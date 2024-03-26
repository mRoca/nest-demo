import { RuleName } from '@/promocode/domain/models/rules/RuleName';

export default class ValidationRequestContext {
  public readonly steps: RuleName[] = [];

  constructor(steps?: RuleName[]) {
    this.steps = steps ?? [];
  }

  getCurrentPath(): string {
    return this.steps.map((ruleName) => ruleName.value).join('.');
  }

  withNewPathStep(parent: RuleName): ValidationRequestContext {
    return new ValidationRequestContext([...this.steps, parent]);
  }
}
