import { ValidationError } from 'class-validator/types/validation/ValidationError';

/*
 * Exemple of ValidationException message:
 *
 * An instance of PromoCodeName has failed the validation:
 *  - property value has failed the following constraints: isNotEmpty
 */
export default class ValidationException extends Error {
  constructor(public readonly errors: ValidationError[]) {
    super(
      errors
        .map((error) => error.toString(false, undefined, undefined, true))
        .join('\n'),
    );
  }
}
