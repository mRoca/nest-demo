@promocodeCreation
Feature: PromoCode creation controller

  Scenario: Creation of a new PromoCode with a good payload
    When I send a POST request to "/promocodes" with body
    """json
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
    """
    Then the response status code should be 201
    And the JSON response should be equal to
    """json
    {
      "id": "$${UUID}",
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
    """

  Scenario: Creation of a new PromoCode with a bad payload
    When I send a POST request to "/promocodes" with body
    """json
    { }
    """
    Then the response status code should be 400
    And the JSON response should be equal to
    """json
    {
      "message": [
        "name must be a string",
        "advantage must be an object",
        "each value in restrictions must be an object",
        "restrictions must be an array"
      ],
      "error": "Bad Request",
      "statusCode": 400
    }
    """

  Scenario: Creation of a new PromoCode with a bad restriction
    When I send a POST request to "/promocodes" with body
    """json
    {
      "name": "Foo",
      "advantage": { "percent": 20 },
      "restrictions": [{"not_existing": { "eq": 40 }}]
    }
    """
    Then the response status code should be 400
    And the JSON node "message" should be equal to "Unable to parse the rules: Unknown rule name 'not_existing'"

  Scenario: Creation of a new PromoCode with a bad restriction details
    When I send a POST request to "/promocodes" with body
    """json
    {
      "name": "Foo",
      "advantage": { "percent": 20 },
      "restrictions": [{"date": { "bad_prop": 40 }}]
    }
    """
    Then the response status code should be 400
    And the JSON node "message" should be equal to
    """json
    ["You must provide eq or gt or lt"]
    """

  Scenario: Creation of a new PromoCode with an already existing name
    When I send a POST request to "/promocodes" with body
    """json
    {
      "name": "Foo",
      "advantage": { "percent": 20 },
      "restrictions": [{"age": { "eq": 40 }}]
    }
    """
    Then the response status code should be 201
    When I send a POST request to "/promocodes" with body
    """json
    {
      "name": "Foo",
      "advantage": { "percent": 30 },
      "restrictions": [{"age": { "eq": 10 }}]
    }
    """
    Then the response status code should be 400
    And the JSON node "message" should be equal to "Another code with the same name already exist."
