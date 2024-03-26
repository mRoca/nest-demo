import NumberComparator, {
  NumberComparatorRules,
} from '@/promocode/domain/models/rules/NumberComparator';
import ValidationRequestData from '@/promocode/domain/models/ValidationRequestData';
import ValidationRequestContext from '@/promocode/domain/models/ValidationRequestContext';
import ValidateRequestException from '@/promocode/domain/exceptions/ValidateRequestException';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';

export default class AgeComparator extends NumberComparator {
  constructor(rules: NumberComparatorRules) {
    super(new RuleName('age'), rules);
  }

  validateRequest(
    data: ValidationRequestData,
    context: ValidationRequestContext,
  ): void {
    if (!this.isValidAgainst(data.age)) {
      throw new ValidateRequestException(
        'The age does not match',
        context.withNewPathStep(this._name),
      );
    }
  }
}
