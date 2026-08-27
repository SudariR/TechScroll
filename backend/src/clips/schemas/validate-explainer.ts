import { explainerSchema, Explainer } from './explainer.schema';

export interface ValidationFailure {
  path: string;
  message: string;
}

export class ExplainerValidationError extends Error {
  constructor(public readonly issues: ValidationFailure[]) {
    super(
      `Explainer failed validation:\n` +
        issues.map((i) => `  • ${i.path}: ${i.message}`).join('\n'),
    );
    this.name = 'ExplainerValidationError';
  }
}

export function validateExplainer(input: unknown): Explainer {
  const result = explainerSchema.safeParse(input);

  if (!result.success) {
    throw new ExplainerValidationError(
      result.error.issues.map((i) => ({
        path: i.path.join('.') || '(root)',
        message: i.message,
      })),
    );
  }

  return result.data;
}