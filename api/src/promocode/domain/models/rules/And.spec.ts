import ValidationException from '@/shared/domain/assertions/ValidationException';
import RestrictionRule from '@/promocode/domain/models/rules/RestrictionRule';
import ValidateRequestException from '@/promocode/domain/exceptions/ValidateRequestException';
import And from '@/promocode/domain/models/rules/And';
import {
  defaultFalsyRule,
  defaultTruthyRule,
  defaultValidationRequestContext,
  defaultValidationRequestData,
} from '@/promocode/domain/models/rules/Or.spec';

describe('And', () => {
  test('should build', () => {
    expect(new And([defaultFalsyRule])._type).toEqual('And');
    expect(new And([defaultFalsyRule, defaultTruthyRule])._type).toEqual('And');
  });

  test('should not accept invalid data', () => {
    expect(() => new And('' as unknown as RestrictionRule[])).toThrow(
      ValidationException,
    );
    expect(() => new And('' as unknown as RestrictionRule[])).toThrow(
      'rules must be an array',
    );
    expect(() => new And([] as unknown as RestrictionRule[])).toThrow(
      'rules should not be empty',
    );
    expect(() => new And([''] as unknown as RestrictionRule[])).toThrow(
      'each value in rules must be an instance of RestrictionRule',
    );
    expect(() => new And([{}] as unknown as RestrictionRule[])).toThrow(
      'each value in rules must be an instance of RestrictionRule',
    );
  });

  test.each([[defaultTruthyRule], [defaultTruthyRule, defaultTruthyRule]])(
    'should validate a good request - $#',
    (...rules) => {
      const comparator = new And(rules);
      expect(() =>
        comparator.validateRequest(
          defaultValidationRequestData,
          defaultValidationRequestContext,
        ),
      ).not.toThrow();
    },
  );

  test.each([
    [defaultFalsyRule],
    [defaultTruthyRule, defaultTruthyRule, defaultFalsyRule],
  ])('should not validate a bad request - $#', (...rules) => {
    const comparator = new And(rules);
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
    expect(error.message).toEqual('foo.and: Not all conditions are valid');
    expect(error.previousErrors).toHaveLength(1);
    expect(error.previousErrors[0].message).toEqual(
      `foo.and[${rules.length - 1}]: The result is false`,
    );
  });
});
