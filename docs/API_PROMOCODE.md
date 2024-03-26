# PromoCode domain


## Presentation

This project is a demo allowing to:
- create Promo Codes (see bellow)
- validate a payload against a given Promo Code (see bellow)
- All endpoints also documented & tested in [the features folder](../api/test/features)

`POST /promocodes`
```json
{
  "name": "WeatherCode",
  "advantage": { "percent": 20 },
  "restrictions": [
    {
      "date": {
        "after": "2019-01-01",
        "before": "2020-06-30"
      }
    },
    {
      "or": [
        {
          "age": {
            "eq": 40
          }
        },
        {
          "and": [
            {
              "age": {
                "lt": 30,
                "gt": 15
              }
            },
            {
              "weather": {
                "is": "clear",
                "temp": {
                  "gt": 15
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

`POST /promocodes/validate`
```json
{
  "promocode_name": "WeatherCode",
  "arguments": {
    "age": 25,
    "town": "Lyon"
  }
}
```

## Controllers & endpoints

- You can use [the Swagger UI](http://api.localtest.me/_doc) in order to see the API documentation.
- All endpoints are also documented & tested in [the features folder](../api/test/features)

## Weather provider

- If a `OPEN_WEATHER_MAP_API_TOKEN` value is provided:
    - the current weather for a given town is retrieved from [OpenWeather API](https://openweathermap.org/api)
    - See [How to start](https://openweathermap.org/api/one-call-3) if you want to get an API token
- If no token is provided:
    - A Fake provider is used, always returning `30°C` / `clear` for `Lyon, Montpellier, Marseille` and `10°C` / `rain` for other cities

## TODO If the project would have not been a fake demo

### Tests

- **100% coverage** : Test all classes & all errors
- Add a test checking that the `domain` is not using anything else than domain's ressources (except `class-validator` for now)

### Restrictions parser & validator

- Rules parser & validator should be a dedicated library with, with for each rule:
  - normalizer + denormalizer
  - validator
  - DTO
- Rules should be registered in a dedicated service and not listed as a method name in a single class
- Validation could be async

### Weather provider

- Persist the city coordinates cache
- Add a temporary city weather cache with a low TTL (1 hour ?)

### API

- All returned errors should be formatted with the same schema
