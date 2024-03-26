import ValidationException from '@/shared/domain/assertions/ValidationException';
import RestrictionRule from '@/promocode/domain/models/rules/RestrictionRule';
import ValidationRequestData from '@/promocode/domain/models/ValidationRequestData';
import ValidateRequestException from '@/promocode/domain/exceptions/ValidateRequestException';
import Or from '@/promocode/domain/models/rules/Or';
import ValidationRequestContext from '@/promocode/domain/models/ValidationRequestContext';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';

class FalsyRule extends RestrictionRule {
  constructor() {
    super(new RuleName('falsy'));
  }

  validateRequest(_: ValidationRequestData, context: ValidationRequestContext) {
    throw new ValidateRequestException('The result is false', context);
  }
}

class TruthyRule extends RestrictionRule {
  constructor() {
    super(new RuleName('truthy'));
  }

  validateRequest() {
    // it's okay
  }
}

export const defaultFalsyRule = new FalsyRule();
export const defaultTruthyRule = new TruthyRule();
export const defaultValidationRequestData = new ValidationRequestData({
  age: 20,
  town: 'Lyon',
});
export const defaultValidationRequestContext = new ValidationRequestContext([
  new RuleName('foo'),
]);

describe('Or', () => {
  test('should build', () => {
    expect(new Or([defaultFalsyRule])._type).toEqual('Or');
    expect(new Or([defaultFalsyRule, defaultTruthyRule])._type).toEqual('Or');
  });

  test('should not accept invalid data', () => {
    expect(() => new Or('' as unknown as RestrictionRule[])).toThrow(
      ValidationException,
    );
    expect(() => new Or('' as unknown as RestrictionRule[])).toThrow(
      'rules must be an array',
    );
    expect(() => new Or([] as unknown as RestrictionRule[])).toThrow(
      'rules should not be empty',
    );
    expect(() => new Or([''] as unknown as RestrictionRule[])).toThrow(
      'each value in rules must be an instance of RestrictionRule',
    );
    expect(() => new Or([{}] as unknown as RestrictionRule[])).toThrow(
      'each value in rules must be an instance of RestrictionRule',
    );
  });

  test.each([
    [defaultTruthyRule],
    [defaultTruthyRule, defaultTruthyRule],
    [defaultFalsyRule, defaultTruthyRule],
  ])('should validate a good request - $#', (...rules) => {
    const comparator = new Or(rules);
    expect(() =>
      comparator.validateRequest(
        defaultValidationRequestData,
        defaultValidationRequestContext,
      ),
    ).not.toThrow();
  });

  test.each([[defaultFalsyRule], [defaultFalsyRule, defaultFalsyRule]])(
    'should not validate a bad request - $#',
    (...rules) => {
      const comparator = new Or(rules);
      let error: ValidateRequestException;
      try {
        comparator.validateRequest(
          defaultValidationRequestData,
          defaultValidationRequestContext,
        );
      } catch (e: unknown) {
        error = e as ValidateRequestException;
      }
      expect(error).toBeInstanceOf(ValidateRequestException);
      expect(error.message).toEqual('foo.or: No valid conditions found');
      expect(error.previousErrors).toHaveLength(rules.length);
      rules.forEach((_, index) => {
        expect(error.previousErrors[index].message).toEqual(
          `foo.or[${index}]: The result is false`,
        );
      });
    },
  );
});
