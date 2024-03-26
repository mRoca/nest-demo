import { get as objectGetPath } from 'lodash';
import {
  get,
  lastRequestResponse,
  post,
  put,
  setBearerToken,
  theLastResponseStatusCodeShouldBe,
} from './http.context';
import { StepDefinitions } from 'jest-cucumber';
import {
  replaceParametersInString,
  saveParameterValue,
} from '@test/features/steps/parameters.context';
import './expect.toEqualsWithParameters';

export const httpSteps: StepDefinitions = ({ given, when, then }) => {
  given(
    /^I set the Authorization bearer token to "([^"]*)"$/,
    async (token: string) => {
      setBearerToken(replaceParametersInString(token));
    },
  );

  given('I reset the Authorization header', async () => {
    setBearerToken('');
  });

  when(/^I send a GET request to "([^"]*)"$/, async (url: string) => {
    await get(replaceParametersInString(url));
  });

  when(
    /^I send a POST request to "([^"]*)" with body$/,
    async (url: string, body: string) => {
      await post(
        replaceParametersInString(url),
        replaceParametersInString(body),
      );
    },
  );

  when(
    /^I send a PUT request to "([^"]*)" with body$/,
    async (url: string, body: string) => {
      await put(
        replaceParametersInString(url),
        replaceParametersInString(body),
      );
    },
  );

  then(
    /^the response status code should be (\d+)$/,
    theLastResponseStatusCodeShouldBe,
  );

  then(/^the JSON response should be equal to$/, (payload: string) => {
    expect(lastRequestResponse().body).toEqualsWithParameters(
      JSON.parse(replaceParametersInString(payload)),
    );
  });

  then(/^the JSON node "([^"]*)" should exist$/, (path: string) => {
    expect(objectGetPath(lastRequestResponse().body, path)).toBeDefined();
  });

  then(/^the JSON node "([^"]*)" should not exist$/, (path: string) => {
    expect(objectGetPath(lastRequestResponse().body, path)).not.toBeDefined();
  });

  then(
    /^the JSON node "([^"]*)" should be equal to$/,
    (path: string, payload: string) => {
      expect(
        objectGetPath(lastRequestResponse().body, path),
      ).toEqualsWithParameters(JSON.parse(replaceParametersInString(payload)));
    },
  );

  then(
    /^the JSON node "([^"]*)" should be equal to "([^"]*)"$/,
    (path: string, expected: string) => {
      expect(objectGetPath(lastRequestResponse().body, path)).toEqual(
        replaceParametersInString(expected),
      );
    },
  );

  then(
    /^the JSON node "([^"]*)" should not be equal to "([^"]*)"$/,
    (path: string, expected: string) => {
      expect(objectGetPath(lastRequestResponse().body, path)).not.toEqual(
        replaceParametersInString(expected),
      );
    },
  );

  then(
    /^the JSON node "([^"]*)" should contain (\d+) elements$/,
    (path: string, length: number) => {
      expect(objectGetPath(lastRequestResponse().body, path)).toHaveLength(
        length,
      );
    },
  );

  then(
    /^I save the JSON node "([^"]*)" value as parameter "([^"]*)"$/,
    (path: string, parameter: string) => {
      expect(objectGetPath(lastRequestResponse().body, path)).toBeDefined();
      saveParameterValue(
        parameter,
        objectGetPath(lastRequestResponse().body, path),
      );
    },
  );

  // Fake timers
  given(/^the date is "([^"]*)"$/, (date: string) => {
    jest.useFakeTimers({ advanceTimers: true, now: Date.parse(date) });
    // jest.setSystemTime(Date.parse(date));
  });

  afterEach(async () => {
    jest.useRealTimers();
  });
};
