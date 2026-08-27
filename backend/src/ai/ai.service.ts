import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import {
  SYSTEM_INSTRUCTION, buildUserPrompt, buildRepairPrompt, PROMPT_VERSION,
} from './prompts/explainer.prompt';
import { validateExplainer, ExplainerValidationError } from '../clips/schemas/validate-explainer';
import type { Explainer } from '../clips/schemas/explainer.schema';

const MODEL = 'gemini-3.5-flash-lite';
const MAX_REPAIRS = 1;

export interface GenerationResult {
  explainer: Explainer;
  model: string;
  promptVersion: string;
  attempts: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ai: GoogleGenAI;

  constructor(config: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: config.getOrThrow<string>('GEMINI_API_KEY'),
    });
  }

  async generateExplainer(article: { title: string; content: string }): Promise<GenerationResult> {
    let prompt = buildUserPrompt(article);
    let lastRaw = '';

    for (let attempt = 1; attempt <= MAX_REPAIRS + 1; attempt++) {
      const response = await this.ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      lastRaw = response.text ?? '';

      try {
        const parsed = JSON.parse(lastRaw);
        const explainer = validateExplainer(parsed);

        this.logger.log(`Generated explainer in ${attempt} attempt(s)`);
        return { explainer, model: MODEL, promptVersion: PROMPT_VERSION, attempts: attempt };
      } catch (err) {
        if (attempt > MAX_REPAIRS) throw err;

        const issues =
          err instanceof ExplainerValidationError
            ? err.issues
            : [{ path: '(root)', message: 'output was not valid JSON' }];

        this.logger.warn(`Attempt ${attempt} failed: ${issues.map(i => i.path).join(', ')}`);
        this.logger.error(`Raw output:\n${lastRaw.slice(0, 800)}`);
        prompt = buildRepairPrompt(lastRaw, issues);
      }
    }

    throw new Error('unreachable');
  }
}