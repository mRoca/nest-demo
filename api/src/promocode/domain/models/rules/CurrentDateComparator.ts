import { assertIsValid } from '@/shared/domain/assertions/Assert';
import { IsInstance, IsOptional } from 'class-validator';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';
import ValidationRequestData from '@/promocode/domain/models/ValidationRequestData';
import ValidationRequestContext from '@/promocode/domain/models/ValidationRequestContext';
import ValidateRequestException from '@/promocode/domain/exceptions/ValidateRequestException';
import NumberComparator, {
  NumberComparatorRules,
} from '@/promocode/domain/models/rules/NumberComparator';

export class DateComparatorRules {
  @IsOptional()
  @IsInstance(Date)
  public readonly before?: Date;

  @IsOptional()
  @IsInstance(Date)
  public readonly after?: Date;

  constructor(rules: { before?: Date; after?: Date }) {
    this.before = rules.before;
    this.after = rules.after;
    assertIsValid(this);
  }

  toNumberComparatorRules(): NumberComparatorRules {
    return new NumberComparatorRules({
      gt: this.after?.getTime(),
      lt: this.before?.getTime(),
    });
  }
}

// TODO Create a better date comparator without using timestamps
export default class CurrentDateComparator extends NumberComparator {
  constructor(rules: DateComparatorRules) {
    super(new RuleName('date'), rules.toNumberComparatorRules());
  }

  validateRequest(
    data: ValidationRequestData,
    context: ValidationRequestContext,
  ): void {
    const currentDate = new Date();
    if (!this.isValidAgainst(currentDate.getTime())) {
      throw new ValidateRequestException(
        'The current date does not match',
        context.withNewPathStep(this._name),
      );
    }
  }
}
