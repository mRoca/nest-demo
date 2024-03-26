import { defineFeature, loadFeatures } from 'jest-cucumber';
import { httpSteps } from '@test/features/steps/http.steps';
import { withHttpServer } from '@test/httpUtils';
import { withHttpContext } from '@test/features/steps/http.context';
import { withHttpParameters } from '@test/features/steps/parameters.context';
import { matchSteps } from 'jest-cucumber/dist/src/validation/step-definition-validation';
import { generateStepCode } from 'jest-cucumber/dist/src/code-generation/step-generation';
import { withDatabaseContext } from '@test/features/steps/database.context';

const features = loadFeatures('test/features/*.feature');

const globalSteps: Array<{
  stepMatcher: string | RegExp;
  stepFunction: () => any;
}> = [];

const registerStep = (
  stepMatcher: string | RegExp,
  stepFunction: () => any,
) => {
  globalSteps.push({ stepMatcher, stepFunction });
};

[httpSteps].forEach((stepDefinitionCallback) => {
  stepDefinitionCallback({
    defineStep: registerStep,
    given: registerStep,
    when: registerStep,
    then: registerStep,
    and: registerStep,
    but: registerStep,
    pending: () => {
      // Nothing to do
    },
  });
});

// This file is a copy of https://github.com/bencompton/jest-cucumber/blob/master/src/automatic-step-binding.ts
// With Before & After hooks
features.forEach((feature) => {
  defineFeature(feature, (test) => {
    withDatabaseContext();
    withHttpServer();
    withHttpContext();
    withHttpParameters();

    const errors: string[] = [];

    feature.scenarios.forEach((scenario) => {
      test(scenario.title, (options) => {
        scenario.steps.forEach((step, stepIndex) => {
          const matches = globalSteps.filter((globalStep) =>
            matchSteps(step.stepText, globalStep.stepMatcher),
          );

          if (matches.length === 1) {
            const match = matches[0];
            options.defineStep(match.stepMatcher, match.stepFunction);
          } else if (matches.length === 0) {
            const stepCode = generateStepCode(scenario.steps, stepIndex, false);
            errors.push(
              `No matching step found for step "${step.stepText}" in scenario "${scenario.title}" in feature "${feature.title}". Please add the following step code: \n\n${stepCode}`,
            );
          } else {
            const matchingCode = matches.map(
              (match) =>
                `${match.stepMatcher.toString()}\n\n${match.stepFunction.toString()}`,
            );
            errors.push(
              `${matches.length} step definition matches were found for step "${step.stepText}" in scenario "${scenario.title}" in feature "${feature.title}". Each step can only have one matching step definition. The following step definition matches were found:\n\n${matchingCode.join('\n\n')}`,
            );
          }
        });
      });
    });

    if (errors.length) {
      throw new Error(errors.join('\n\n'));
    }
  });
});
