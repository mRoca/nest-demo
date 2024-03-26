@promocodeValidation
Feature: PromoCode validation controller

  Scenario: Validation of a good payload
    When I send a POST request to "/promocodes" with body
    """json
    {
      "name": "DemoCode",
      "advantage": { "percent": 20 },
      "restrictions": [
        { "date": { "after": "2020-01-01", "before": "2020-01-31" } },
        { "or": [ { "age": { "eq": 40 } }, { "and": [ { "age": { "lt": 30, "gt": 15 } }, { "weather": { "is": "clear", "temp": { "gt": 15 } } } ] } ] }
      ]
    }
    """
    Then the response status code should be 201

    Given the date is "2020-01-02T10:00:00.000Z"
    When I send a POST request to "/promocodes/validate" with body
    """json
    {
      "promocode_name": "DemoCode",
      "arguments": {
        "age": 25,
        "town": "Lyon"
      }
    }
    """
    Then the response status code should be 200
    And the JSON response should be equal to
    """json
    {
      "promocode_name": "DemoCode",
      "status": "accepted",
      "advantage": { "percent": 20 }
    }
    """

    Given the date is "2020-01-02T10:00:00.000Z"
    When I send a POST request to "/promocodes/validate" with body
    """json
    {
      "promocode_name": "DemoCode",
      "arguments": {
        "age": 40,
        "town": "Paris"
      }
    }
    """
    Then the response status code should be 200
    And the JSON response should be equal to
    """json
    {
      "promocode_name": "DemoCode",
      "status": "accepted",
      "advantage": { "percent": 20 }
    }
    """

  Scenario: Failing to validate a bad payload
    When I send a POST request to "/promocodes" with body
    """json
    {
      "name": "DemoCode",
      "advantage": { "percent": 20 },
      "restrictions": [
        { "date": { "after": "2020-01-01", "before": "2020-01-31" } },
        { "or": [ { "age": { "eq": 40 } }, { "and": [ { "age": { "lt": 30, "gt": 15 } }, { "weather": { "is": "clear", "temp": { "gt": 15 } } } ] } ] }
      ]
    }
    """
    Then the response status code should be 201
    Given the date is "2024-01-02T10:00:00.000Z"
    When I send a POST request to "/promocodes/validate" with body
    """json
    {
      "promocode_name": "DemoCode",
      "arguments": { "age": 14, "town": "Paris" }
    }
    """
    Then the response status code should be 400
    And the JSON response should be equal to
    """json
    {
      "status": "denied",
      "promocode_name": "DemoCode",
      "reasons": [
        {
          "type": "ValidateRequestException",
          "message": "root.and: Not all conditions are valid",
          "path": "root.and"
        },
        {
          "type": "ValidateRequestException",
          "message": "root.and[0].date: The current date does not match",
          "path": "root.and[0].date"
        },
        {
          "type": "ValidateRequestException",
          "message": "root.and[1].or: No valid conditions found",
          "path": "root.and[1].or"
        },
        {
          "type": "ValidateRequestException",
          "message": "root.and[1].or[0].age: The age does not match",
          "path": "root.and[1].or[0].age"
        },
        {
          "type": "ValidateRequestException",
          "message": "root.and[1].or[1].and: Not all conditions are valid",
          "path": "root.and[1].or[1].and"
        },
        {
          "type": "ValidateRequestException",
          "message": "root.and[1].or[1].and[0].age: The age does not match",
          "path": "root.and[1].or[1].and[0].age"
        },
        {
          "type": "ValidateRequestException",
          "message": "root.and[1].or[1].and[1].weather: The weather does not match",
          "path": "root.and[1].or[1].and[1].weather"
        },
        {
          "type": "ValidateRequestException",
          "message": "root.and[1].or[1].and[1].weather.is: The current weather is: 'rain'",
          "path": "root.and[1].or[1].and[1].weather.is"
        },
        {
          "type": "ValidateRequestException",
          "message": "root.and[1].or[1].and[1].weather.temp: The current temperature is 10°C",
          "path": "root.and[1].or[1].and[1].weather.temp"
        }
      ]
    }
    """

  Scenario: Usage of a not existing code
    When I send a POST request to "/promocodes/validate" with body
    """json
    {
      "promocode_name": "NotExisting",
      "arguments": { "age": 14, "town": "Lyon" }
    }
    """
    Then the response status code should be 400
    And the JSON response should be equal to
    """json
    {
      "status": "denied",
      "promocode_name": "NotExisting",
      "reasons": [
        {
          "type": "Error",
          "message": "No PromoCode with name NotExisting found"
        }
      ]
    }
    """

  Scenario: Rejection of a badly formatted payload
    When I send a POST request to "/promocodes/validate" with body
    """json
    {}
    """
    Then the response status code should be 400
    And the JSON node "message" should be equal to
    """json
    [
      "promocode_name must be a string",
      "arguments must be an object"
    ]
    """

    When I send a POST request to "/promocodes/validate" with body
    """json
    {
      "promocode_name": "foo",
      "arguments": {
        "age": "too old"
      }
    }
    """
    Then the response status code should be 400
    And the JSON node "message" should be equal to
    """json
    [
      "arguments.age must not be greater than 200",
      "arguments.age must not be less than 0",
      "arguments.age must be a number conforming to the specified constraints",
      "arguments.town should not be empty",
      "arguments.town must be a string"
    ]
    """
