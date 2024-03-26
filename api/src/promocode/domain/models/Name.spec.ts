import { Name } from '@/promocode/domain/models/Name';
import ValidationException from '@/shared/domain/assertions/ValidationException';

describe('PromoCode Name', () => {
  test('should build', () => {
    const item = new Name('MyCode');
    expect(item.value).toEqual('MyCode');
  });

  test('should not accept invalid data', () => {
    expect(() => new Name('')).toThrow(ValidationException);
    expect(() => new Name('')).toThrow('value should not be empty');
    expect(() => new Name(2 as unknown as string)).toThrow(ValidationException);
    expect(() => new Name(2 as unknown as string)).toThrow(
      'value must be a string',
    );
  });
});
