import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { writeFileSync } from 'node:fs';
import { AppModule } from '../../app.module';
import { AiService } from '../ai.service';
import { EVAL_ARTICLES } from './fixtures/articles';
import { runQualityChecks, QualityWarning } from './quality-checks';
import { ExplainerValidationError } from '../../clips/schemas/validate-explainer';
import { PROMPT_VERSION } from '../prompts/explainer.prompt';

const RUNS_PER_ARTICLE = Number(process.env.EVAL_RUNS ?? 2);
const DELAY_MS = Number(process.env.EVAL_DELAY_MS ?? 4000); // free-tier rate limits

interface RunRecord {
  slug: string;
  run: number;
  ok: boolean;
  attempts: number;
  latencyMs: number;
  categoryMatch?: boolean;
  validationIssues: string[];
  qualityWarnings: QualityWarning[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const logger = new Logger('PromptEval');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  const ai = app.get(AiService);

  const records: RunRecord[] = [];

  for (const article of EVAL_ARTICLES) {
    for (let run = 1; run <= RUNS_PER_ARTICLE; run++) {
      const started = Date.now();
      process.stdout.write(`  ${article.slug} (run ${run})... `);

      try {
        const result = await ai.generateExplainer({
          title: article.title,
          content: article.content,
        });

        const warnings = runQualityChecks(result.explainer);

        records.push({
          slug: article.slug,
          run,
          ok: true,
          attempts: result.attempts,
          latencyMs: Date.now() - started,
          categoryMatch: result.explainer.category === article.expectedCategory,
          validationIssues: [],
          qualityWarnings: warnings,
        });

        console.log(
          `ok (${result.attempts} attempt${result.attempts > 1 ? 's' : ''}, ${warnings.length} warnings)`,
        );
      } catch (err) {
        const issues =
          err instanceof ExplainerValidationError
            ? err.issues.map((i) => `${i.path}: ${i.message}`)
            : [(err as Error).message];

        records.push({
          slug: article.slug,
          run,
          ok: false,
          attempts: 3,
          latencyMs: Date.now() - started,
          validationIssues: issues,
          qualityWarnings: [],
        });

        console.log(`FAILED`);
      }

      await sleep(DELAY_MS);
    }
  }

  report(records);
  await app.close();
}

function report(records: RunRecord[]) {
  const total = records.length;
  const passed = records.filter((r) => r.ok);
  const firstTry = passed.filter((r) => r.attempts === 1);
  const repaired = passed.filter((r) => r.attempts > 1);

  const pct = (n: number) => `${((n / total) * 100).toFixed(0)}%`;
  const avg = (ns: number[]) =>
    ns.length ? Math.round(ns.reduce((a, b) => a + b, 0) / ns.length) : 0;

  console.log(`\n${'='.repeat(58)}`);
  console.log(`PROMPT EVAL — ${PROMPT_VERSION}`);
  console.log('='.repeat(58));
  console.log(`runs                 ${total}`);
  console.log(`valid on attempt 1   ${firstTry.length}/${total}  ${pct(firstTry.length)}`);
  console.log(`valid after repair   ${repaired.length}/${total}  ${pct(repaired.length)}`);
  console.log(`unrecoverable        ${total - passed.length}/${total}`);
  console.log(`category accuracy    ${passed.filter(r => r.categoryMatch).length}/${passed.length}`);
  console.log(`avg latency          ${avg(records.map((r) => r.latencyMs))}ms`);

//   const validationCounts = tally(records.flatMap((r) => r.validationIssues.map((i) => i.split(':')[0])));
//  
const validationCounts = tally(
  records.flatMap((r) => r.validationIssues.map((i) => i.slice(0, 120)))
);
 if (validationCounts.length) {
    console.log(`\n-- validation failures by field --`);
    validationCounts.forEach(([k, n]) => console.log(`  ${n.toString().padStart(3)}  ${k}`));
  }

  const qualityCounts = tally(records.flatMap((r) => r.qualityWarnings.map((w) => w.code)));
  if (qualityCounts.length) {
    console.log(`\n-- quality warnings by type --`);
    qualityCounts.forEach(([k, n]) => console.log(`  ${n.toString().padStart(3)}  ${k}`));
  }

  const worst = [...records].sort(
    (a, b) => b.qualityWarnings.length - a.qualityWarnings.length,
  )[0];
  if (worst?.qualityWarnings.length) {
    console.log(`\n-- worst run: ${worst.slug} (run ${worst.run}) --`);
    worst.qualityWarnings.forEach((w) => console.log(`  ${w.code}: ${w.detail}`));
  }

  writeFileSync(
    `eval-report-${PROMPT_VERSION}.json`,
    JSON.stringify({ promptVersion: PROMPT_VERSION, generatedAt: new Date().toISOString(), records }, null, 2),
  );
  console.log(`\nreport written to eval-report-${PROMPT_VERSION}.json\n`);
}

function tally(items: string[]): [string, number][] {
  const map = new Map<string, number>();
  items.forEach((i) => map.set(i, (map.get(i) ?? 0) + 1));
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});