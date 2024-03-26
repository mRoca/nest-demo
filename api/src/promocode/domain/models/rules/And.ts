import RestrictionRule from '@/promocode/domain/models/rules/RestrictionRule';
import { assertIsValid } from '@/shared/domain/assertions/Assert';
import { ArrayNotEmpty, IsArray, IsInstance } from 'class-validator';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';
import ValidationRequestData from '@/promocode/domain/models/ValidationRequestData';
import ValidationRequestContext from '@/promocode/domain/models/ValidationRequestContext';
import ValidateRequestException from '@/promocode/domain/exceptions/ValidateRequestException';

export default class And extends RestrictionRule {
  @IsArray()
  @ArrayNotEmpty()
  @IsInstance(RestrictionRule, { each: true })
  public readonly rules: RestrictionRule[];

  constructor(rules: RestrictionRule[]) {
    super(new RuleName('and'));
    this.rules = rules;
    assertIsValid(this);
  }

  validateRequest(
    data: ValidationRequestData,
    context: ValidationRequestContext,
  ): void {
    const errors = [];
    this.rules.forEach((rule: RestrictionRule, index: number) => {
      try {
        rule.validateRequest(
          data,
          context.withNewPathStep(this._name.forIndex(index)),
        );
      } catch (e) {
        errors.push(e);
      }
    });

    if (errors.length === 0) {
      return;
    }

    throw new ValidateRequestException(
      'Not all conditions are valid',
      context.withNewPathStep(this._name),
      errors,
    );
  }
}
