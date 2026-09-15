import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import {
  SYSTEM_INSTRUCTION,
  buildUserPrompt,
  buildRepairPrompt,
  PROMPT_VERSION,
} from './prompts/explainer.prompt';
import { buildBridgePrompt } from './prompts/bridge.prompt';
import {
  validateExplainer,
  ExplainerValidationError,
} from '../clips/schemas/validate-explainer';
import type { Explainer } from '../clips/schemas/explainer.schema';

const MODEL = 'gemini-3.5-flash-lite';
const MAX_REPAIRS = 1;

const bridgeSchema = z.object({
  previously: z.string().min(20).max(180),
  nowWhat: z.string().min(20).max(180),
});

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

  async generateExplainer(article: {
    title: string;
    content: string;
  }): Promise<GenerationResult> {
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
        return {
          explainer,
          model: MODEL,
          promptVersion: PROMPT_VERSION,
          attempts: attempt,
        };
      } catch (err) {
        if (attempt > MAX_REPAIRS) throw err;

        const issues =
          err instanceof ExplainerValidationError
            ? err.issues
            : [{ path: '(root)', message: 'output was not valid JSON' }];

        this.logger.warn(
          `Attempt ${attempt} failed: ${issues.map((i) => i.path).join(', ')}`,
        );
        this.logger.error(`Raw output:\n${lastRaw.slice(0, 800)}`);
        prompt = buildRepairPrompt(lastRaw, issues);
      }
    }

    throw new Error('unreachable');
  }

  async generateBridge(input: {
    storyLabel: string;
    chapterNumber: number;
    previousTakeaways: string[];
    currentTitle: string;
    currentHook: string;
    currentTakeaway: string;
  }): Promise<{ previously: string; nowWhat: string } | null> {
    try {
      const prompt = buildBridgePrompt(input);
      const response = await this.ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const raw = response.text ?? '';
      const parsed = JSON.parse(raw);
      const validated = bridgeSchema.parse(parsed);

      this.logger.log(
        `Generated bridge for chapter ${input.chapterNumber} of "${input.storyLabel}"`,
      );
      return validated;
    } catch (err) {
      this.logger.warn(
        `Failed to generate bridge for "${input.storyLabel}" ch ${input.chapterNumber}: ${(err as Error).message}`,
      );
      return null;
    }
  }
}
