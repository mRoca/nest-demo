import { UUID } from '@/promocode/domain/models/UUID';
import ValidationException from '@/shared/domain/assertions/ValidationException';

describe('UUID', () => {
  test('should build', () => {
    expect(new UUID('89af9a51-e988-45de-92e2-69445e00a926').value).toEqual(
      '89af9a51-e988-45de-92e2-69445e00a926',
    );
  });

  test('should allow to generate a new uuid', () => {
    expect(UUID.create()).toBeInstanceOf(UUID);
  });

  test('should throw exception when input not UUID', () => {
    expect(() => new UUID('')).toThrow(ValidationException);
    expect(() => new UUID('')).toThrow('value must be a UUID');
    expect(() => new UUID('xxx')).toThrow('value must be a UUID');
  });
});
