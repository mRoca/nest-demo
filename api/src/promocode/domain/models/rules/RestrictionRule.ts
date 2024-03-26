import ValidationRequestData from '@/promocode/domain/models/ValidationRequestData';
import ValidationRequestContext from '@/promocode/domain/models/ValidationRequestContext';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';
import ValidateRequestException from '@/promocode/domain/exceptions/ValidateRequestException';

// TODO This class should be abstract, but we cannot use @IsInstance() on abstract classes. A dedicated validator should be created.
export default class RestrictionRule {
  public readonly _type: string;
  public readonly _name: RuleName;

  constructor(name: RuleName) {
    this._type = this.constructor.name;
    this._name = name;
  }

  validateRequest(
    data: ValidationRequestData,
    context: ValidationRequestContext,
  ): void {
    // Should be implemented
    throw new ValidateRequestException(
      `The validateRequest method should be implemented in ${this._type}`,
      context,
    );
  }
}
