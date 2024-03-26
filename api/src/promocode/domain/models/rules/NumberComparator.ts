import RestrictionRule from '@/promocode/domain/models/rules/RestrictionRule';
import { assertIsValid } from '@/shared/domain/assertions/Assert';
import {
  IsInstance,
  isInstance,
  IsNumber,
  isNumber,
  IsOptional,
  Validate,
  ValidateNested,
  validateSync,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';

@ValidatorConstraint({ name: 'numberComparatorRules', async: false })
export class NumberComparatorRulesValidator
  implements ValidatorConstraintInterface
{
  private errorMessage?: string;

  validate(rules: NumberComparatorRules) {
    if (validateSync(rules).length > 0) {
      // Detailed errors will be returned by other validators
      this.errorMessage = 'You must provide a valid rules object';
      return false;
    }

    if (!isNumber(rules.eq) && !isNumber(rules.gt) && !isNumber(rules.lt)) {
      this.errorMessage = 'You must provide eq or gt or lt';
      return false;
    }

    if (isNumber(rules.eq) && (isNumber(rules.gt) || isNumber(rules.lt))) {
      this.errorMessage = 'You could not provide eq and gt or lt';
      return false;
    }

    if (isNumber(rules.gt) && isNumber(rules.lt) && rules.gt >= rules.lt) {
      this.errorMessage = 'gt must be lower than lt';
      return false;
    }

    return true;
  }

  defaultMessage() {
    return this.errorMessage;
  }
}

export class NumberComparatorRules {
  @IsNumber()
  @IsOptional()
  public readonly eq?: number;

  @IsNumber()
  @IsOptional()
  public readonly lt?: number;

  @IsNumber()
  @IsOptional()
  public readonly gt?: number;

  constructor(rules: { eq?: number; lt?: number; gt?: number }) {
    this.eq = rules.eq;
    this.lt = rules.lt;
    this.gt = rules.gt;
  }
}

export default class NumberComparator extends RestrictionRule {
  @IsInstance(NumberComparatorRules)
  @ValidateNested()
  @Validate(NumberComparatorRulesValidator)
  public readonly rules: NumberComparatorRules;

  constructor(ruleName: RuleName, rules: object | NumberComparatorRules) {
    super(ruleName);
    this.rules = isInstance(rules, NumberComparatorRules)
      ? rules
      : new NumberComparatorRules(rules);
    assertIsValid(this);
  }

  // TODO Throw exceptions with message instead of returning false in order to detect the failed sub-rule ?
  isValidAgainst(value: number): boolean {
    if (!isNumber(value)) {
      throw new TypeError('A number must be provided');
    }

    if (isNumber(this.rules.eq)) {
      return this.rules.eq === value;
    }

    if (isNumber(this.rules.gt) && isNumber(this.rules.lt)) {
      return value > this.rules.gt && value < this.rules.lt;
    }

    if (isNumber(this.rules.gt)) {
      return value > this.rules.gt;
    }

    if (isNumber(this.rules.lt)) {
      return value < this.rules.lt;
    }
  }
}
