import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class JsonLogger extends ConsoleLogger {
  private excludedContexts = [
    'InstanceLoader',
    'RouterExplorer',
    'RoutesResolver',
    'ClsModule',
    'NestFactory',
  ];

  constructor(
    context?: string,
    private readonly cls?: ClsService,
  ) {
    super(context);
    this.cls = cls;
  }

  protected formatPid(pid: number): string {
    return `${pid}`;
  }

  protected colorize(message: string): string {
    return message;
  }

  protected formatContext(context: string): string {
    return context;
  }

  protected stringifyMessage(message: unknown, logLevel: LogLevel): string {
    if (message instanceof Error) {
      return `${message.name}: ${message.message}`;
    }
    return super.stringifyMessage(message, logLevel);
  }

  protected getTimestamp(): string {
    return new Date().toJSON();
  }

  protected formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
  ): string {
    return `${JSON.stringify({
      context: contextMessage,
      message: this.stringifyMessage(message, logLevel),
      level: logLevel,
      date: this.getTimestamp(),
      requestId: this.cls?.getId() || undefined, // The unique CorrelationID for a given request
    })}\n`;
  }

  protected printMessages(
    messages: unknown[],
    context?: string,
    logLevel?: LogLevel,
    writeStreamType?: 'stdout' | 'stderr',
  ): void {
    if (context && this.excludedContexts.includes(context)) {
      return;
    }

    super.printMessages(messages, context, logLevel, writeStreamType);
  }
}
