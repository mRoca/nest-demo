const parametersBag = new Map();

export const withHttpParameters = () => {
  afterEach(async () => {
    parametersBag.clear();
  });
};

export const saveParameterValue = (key: string, value: string) => {
  parametersBag.set(key, value);
};

export const replaceParametersInString = (payload: string): string => {
  let newPayload = payload;
  parametersBag.forEach((value, key) => {
    newPayload = newPayload.replaceAll(`\${${key}}`, value);
  });

  const remainingParams = newPayload.match(/[^$]\$\{\w+}/g);
  if (remainingParams?.length) {
    console.warn(
      '>> Caution: the string still contains unknown parameters:',
      remainingParams.join(', '),
    );
    console.warn('>> Tips: the parameters bag is cleared after each scenario.');
  }

  return newPayload;
};
