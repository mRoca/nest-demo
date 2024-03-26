import { validateSync } from 'class-validator';
import ValidationException from '@/shared/domain/assertions/ValidationException';

export const assertIsValid = (target: object): void => {
  const errors = validateSync(target, { validationError: { target: true } });
  if (!errors.length) {
    return;
  }

  throw new ValidationException(errors);
};
