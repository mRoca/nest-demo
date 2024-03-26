import { ClsService } from 'nestjs-cls';
import { JsonLogger } from '@/app/logger/JsonLogger';
import { createStubInstance } from '@test/utils';

describe('JsonLogger', () => {
  const cls = createStubInstance(ClsService);
  const logger = new JsonLogger(undefined, cls);
  const stdout = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
  const stderr = jest.spyOn(process.stderr, 'write').mockReturnValue(true);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-05T08:24:54Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should allow to log a message', () => {
    logger.log('foo');
    expect(stdout).toHaveBeenCalledWith(
      '{"context":"","message":"foo","level":"log","date":"2024-06-05T08:24:54.000Z"}\n',
    );
  });

  test('should allow to have a default context', () => {
    new JsonLogger('default', cls).log('foo');
    expect(stdout).toHaveBeenCalledWith(
      '{"context":"default","message":"foo","level":"log","date":"2024-06-05T08:24:54.000Z"}\n',
    );
  });

  test('should allow to log a message for a given context', () => {
    logger.log('foo', 'bar');
    expect(stdout).toHaveBeenCalledWith(
      '{"context":"bar","message":"foo","level":"log","date":"2024-06-05T08:24:54.000Z"}\n',
    );
  });

  test('should not log excluded contexts', () => {
    logger.log('foo', 'InstanceLoader');
    expect(stdout).not.toHaveBeenCalled();
  });

  test('should allow to log an error', () => {
    logger.error(new Error('the message'));
    expect(stderr).toHaveBeenCalledWith(
      '{"context":"","message":"Error: the message","level":"error","date":"2024-06-05T08:24:54.000Z"}\n',
    );
  });

  test('should log the request ID', () => {
    cls.getId.mockReturnValue('REQ');
    logger.debug('foo');
    expect(stdout).toHaveBeenCalledWith(
      '{"context":"","message":"foo","level":"debug","date":"2024-06-05T08:24:54.000Z","requestId":"REQ"}\n',
    );
  });
});
