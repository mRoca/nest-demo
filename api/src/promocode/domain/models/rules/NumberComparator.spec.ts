import ValidationException from '@/shared/domain/assertions/ValidationException';
import NumberComparator, {
  NumberComparatorRules,
} from '@/promocode/domain/models/rules/NumberComparator';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';

const defaultRuleName = new RuleName('foo');

describe('NumberComparator', () => {
  test('should build', () => {
    expect(new NumberComparator(defaultRuleName, { eq: 1 })._type).toEqual(
      'NumberComparator',
    );
    expect(
      new NumberComparator(
        defaultRuleName,
        new NumberComparatorRules({ eq: 1 }),
      )._type,
    ).toEqual('NumberComparator');
  });

  test('should not accept invalid data', () => {
    expect(() => new NumberComparator(defaultRuleName, {})).toThrow(
      ValidationException,
    );
    expect(() => new NumberComparator(defaultRuleName, {})).toThrow(
      'You must provide eq or gt or lt',
    );
    expect(
      () =>
        new NumberComparator(defaultRuleName, { eq: '1' as unknown as number }),
    ).toThrow('eq must be a number');
    expect(
      () =>
        new NumberComparator(defaultRuleName, { eq: '1' as unknown as number }),
    ).toThrow('You must provide a valid rules object');
    expect(
      () => new NumberComparator(defaultRuleName, { eq: 1, gt: 1 }),
    ).toThrow('You could not provide eq and gt or lt');
    expect(
      () => new NumberComparator(defaultRuleName, { eq: 1, lt: 1 }),
    ).toThrow('You could not provide eq and gt or lt');
    expect(
      () => new NumberComparator(defaultRuleName, { gt: 1, lt: 1 }),
    ).toThrow('gt must be lower than lt');
  });

  test('should be validated against input value for eq operation', () => {
    const comparator = new NumberComparator(defaultRuleName, { eq: 1 });
    expect(comparator.isValidAgainst(1)).toEqual(true);
    expect(comparator.isValidAgainst(0)).toEqual(false);
    expect(comparator.isValidAgainst(1.1)).toEqual(false);
    expect(comparator.isValidAgainst(-1)).toEqual(false);
  });

  test('should be validated against input value for lt operation', () => {
    const comparator = new NumberComparator(defaultRuleName, { lt: 1 });
    expect(comparator.isValidAgainst(2)).toEqual(false);
    expect(comparator.isValidAgainst(1)).toEqual(false);
    expect(comparator.isValidAgainst(0)).toEqual(true);
  });

  test('should be validated against input value for gt operation', () => {
    const comparator = new NumberComparator(defaultRuleName, { gt: 1 });
    expect(comparator.isValidAgainst(2)).toEqual(true);
    expect(comparator.isValidAgainst(1)).toEqual(false);
    expect(comparator.isValidAgainst(0)).toEqual(false);
  });

  test('should be validated against input value for lt and gt operations', () => {
    const comparator = new NumberComparator(defaultRuleName, { gt: 1, lt: 3 });
    expect(comparator.isValidAgainst(3)).toEqual(false);
    expect(comparator.isValidAgainst(2)).toEqual(true);
    expect(comparator.isValidAgainst(1)).toEqual(false);
  });

  test('should not be validated against bad input value', () => {
    const comparator = new NumberComparator(defaultRuleName, { eq: 1 });
    expect(() =>
      comparator.isValidAgainst(defaultRuleName as unknown as number),
    ).toThrow(TypeError);
    expect(() => comparator.isValidAgainst('1' as unknown as number)).toThrow(
      'A number must be provided',
    );
  });
});
