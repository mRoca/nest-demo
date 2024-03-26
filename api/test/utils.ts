/**
 * Creates a new object with the given functions as the prototype and mock all implemented methods.
 * See https://jestjs.io/docs/mock-functions for available mock functions
 *
 * @template T Type being stubbed.
 * @param constructor Object or class to stub.
 * @param forceAllMethodsMock If true, any called non-mocked method with throw an exception
 * @returns A stubbed version of the constructor.
 * @remarks The given constructor function is not invoked.
 */
export const createStubInstance = <T>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor: Function & { prototype: T },
  forceAllMethodsMock: boolean = false,
): T & jest.MockedObject<T> => {
  if (typeof constructor !== 'function') {
    throw new TypeError('The constructor should be a function.');
  }

  const stubInstance = {} as T;

  (Object.getOwnPropertyNames(constructor.prototype) as (keyof T)[]).forEach(
    (method) => {
      if (method === 'constructor') {
        return;
      }

      stubInstance[method] = jest.fn(() => {
        if (forceAllMethodsMock) {
          throw new Error(
            `You should mock ${constructor.name}.${String(method)}`,
          );
        }
      }) as T[keyof T];
    },
  );

  return stubInstance as T & jest.MockedObject<T>;
};
