import { isEqualWith, isString } from 'lodash';
import { saveParameterValue } from '@test/features/steps/parameters.context';
import { isUUID } from 'validator';
import { expect } from '@jest/globals';
import type { MatcherFunction } from 'expect';
import { diff } from 'jest-diff';

/**
 * Custom lodash equality customizer, checking "$${FOO:BAR}" patterns in JSON payload. This function only allows full parameters values for now.
 * If necessary, update it in order to allow "bar$${UUID:VAR}baz"
 *  Matches:
 *   $${THE_TYPE}
 *   $${THE_TYPE:THE_VAR_NAME}
 *   $${:THE_VAR_NAME}
 */
const isEqualJsonCustomizer = (
  actualValue: unknown,
  expectedValue: unknown,
): boolean | undefined => {
  const placeholderPattern =
    /^\$\$\{(?<type>[A-Z0-9_]+)?(:(?<parameter>[A-Z0-9_]+))?}$/;
  if (
    !isString(expectedValue) ||
    !isString(actualValue) ||
    !expectedValue.match(placeholderPattern)
  ) {
    return undefined;
  }

  const type = expectedValue.match(placeholderPattern)?.groups?.type;
  if (isString(type) && !isValidCustomType(type, actualValue)) {
    console.error(`JSON: ${actualValue} is not a valid ${type}`);

    return false;
  }

  const paramName = expectedValue.match(placeholderPattern)?.groups?.parameter;
  if (paramName) {
    saveParameterValue(paramName, actualValue);
  }

  return true;
};

const isValidCustomType = (type: string, actualValue: string): boolean => {
  if (type === 'UUID' && !isUUID(actualValue)) {
    return false;
  }

  if (
    type === 'DATETIME' &&
    !actualValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/)
  ) {
    return false;
  }

  if (
    type === 'BASE64' &&
    !actualValue.match(
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
    )
  ) {
    return false;
  }

  return true;
};

const expectToEqualsWithParameters: MatcherFunction<[expected: unknown]> =
  function (actual, expected: unknown) {
    const areEqual = isEqualWith(actual, expected, isEqualJsonCustomizer);
    if (!areEqual) {
      console.log('== Actual payload ==');
      console.log(JSON.stringify(actual, null, 2)); // Let's dump payload in order to easily do some copy & paste
    }

    return {
      message: () => diff(expected, actual),
      pass: areEqual,
    };
  };

expect.extend({ toEqualsWithParameters: expectToEqualsWithParameters });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toEqualsWithParameters(expected: unknown): R;
    }
    interface AsymmetricMatchers {
      toEqualsWithParameters(expected: unknown): void;
    }
  }
}
