export const restrictionsExample = {
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
