import RestrictionRuleDenormalizer from '@/promocode/domain/factories/RestrictionRuleDenormalizer';

export const defaultPromoCodePayload = {
  name: 'WeatherCode',
  advantage: { percent: 20 },
  restrictions: [
    {
      date: {
        after: '2019-01-01',
        before: '2020-06-30',
      },
    },
    {
      or: [
        {
          age: {
            eq: 40,
          },
        },
        {
          and: [
            {
              age: {
                lt: 30,
                gt: 15,
              },
            },
            {
              weather: {
                is: 'clear',
                temp: {
                  gt: 15, // Celsius here.
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

describe('RestrictionRuleDenormalizer', () => {
  const denormalizer = new RestrictionRuleDenormalizer();

  test('should parse a valid array', () => {
    const rule = denormalizer.createFromArray(
      defaultPromoCodePayload.restrictions,
    );
    const rawRule = JSON.parse(JSON.stringify(rule));
    expect(rawRule).toEqual({
      _type: 'RulesList',
      _name: 'and',
      rules: [
        {
          _type: 'CurrentDateComparator',
          _name: 'date',
          rules: {
            gt: 1546300800000,
            lt: 1593475200000,
          },
        },
        {
          _type: 'Or',
          _name: 'or',
          rules: [
            {
              _type: 'AgeComparator',
              _name: 'age',
              rules: {
                eq: 40,
              },
            },
            {
              _type: 'And',
              _name: 'and',
              rules: [
                {
                  _type: 'AgeComparator',
                  _name: 'age',
                  rules: {
                    gt: 15,
                    lt: 30,
                  },
                },
                {
                  _type: 'WeatherChecker',
                  _name: 'weather',
                  expectedWeather: 'clear',
                  temperatureChecker: {
                    _type: 'TemperatureComparator',
                    _name: 'temp',
                    rules: {
                      gt: 15,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
