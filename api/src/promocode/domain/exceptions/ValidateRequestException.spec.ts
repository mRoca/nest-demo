import ValidationRequestContext from '@/promocode/domain/models/ValidationRequestContext';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';
import ValidateRequestException from '@/promocode/domain/exceptions/ValidateRequestException';

describe('ValidateRequestException', () => {
  test('should build', () => {
    const previousValidateRequestExceptionContext =
      new ValidationRequestContext([
        new RuleName('root'),
        new RuleName('rule1'),
      ]);
    const previousValidateRequestException = new ValidateRequestException(
      'bar',
      previousValidateRequestExceptionContext,
      [new Error('rule1child')],
    );
    const previous = [new Error('foo'), previousValidateRequestException];

    const error = new ValidateRequestException(
      'The message',
      new ValidationRequestContext([new RuleName('root')]),
      previous,
    );

    expect(error.message).toEqual('root: The message');
    const flattenedErrors = error.getFlattenedErrors();
    expect(flattenedErrors).toHaveLength(4);
    expect(flattenedErrors[0].message).toEqual('root: The message');
    expect(flattenedErrors[1].message).toEqual('foo');
    expect(flattenedErrors[2].message).toEqual('root.rule1: bar');
    expect(flattenedErrors[3].message).toEqual('rule1child');
  });
});
