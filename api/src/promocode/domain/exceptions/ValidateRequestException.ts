import ValidationRequestContext from '@/promocode/domain/models/ValidationRequestContext';

export default class ValidateRequestException extends Error {
  constructor(
    message: string,
    public readonly context: ValidationRequestContext,
    public readonly previousErrors: Error[] = [],
  ) {
    super(`${context.getCurrentPath()}: ${message}`);
  }

  getFlattenedErrors(): Error[] {
    return this.previousErrors.reduce(
      (errors: Error[], currentError: Error) => {
        const newErrors =
          currentError instanceof ValidateRequestException
            ? [...currentError.getFlattenedErrors()]
            : [currentError];

        return errors.concat(newErrors);
      },
      [this],
    );
  }

  toJson(): object {
    return {
      type: this.constructor.name,
      message: this.message,
      path: this.context.getCurrentPath(),
    };
  }
}
