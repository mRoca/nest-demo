import { Advantage } from '@/promocode/domain/models/Advantage';
import ValidationException from '@/shared/domain/assertions/ValidationException';

describe('Advantage', () => {
  test('should build', () => {
    const item = new Advantage(20);
    expect(item.reductionPercentage).toEqual(20);
  });

  test('should not accept invalid data', () => {
    expect(() => new Advantage(undefined as unknown as number)).toThrow(
      ValidationException,
    );
    expect(() => new Advantage(undefined as unknown as number)).toThrow(
      'reductionPercentage must be an integer number',
    );
    expect(() => new Advantage('2' as unknown as number)).toThrow(
      'reductionPercentage must be an integer number',
    );
    expect(() => new Advantage(-2)).toThrow(
      'reductionPercentage must be a positive number',
    );
  });
});
