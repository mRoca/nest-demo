@init
Feature: Default controller

  Scenario: The main endpoint must return a response
    When I send a GET request to "/"
    Then the response status code should be 200
    And the JSON response should be equal to
    """json
    { "message": "Welcome to this server :-)" }
    """

  Scenario: The healthcheck endpoint must return a response
    When I send a GET request to "/health"
    Then the response status code should be 200
    And the JSON response should be equal to
    """json
    { "alive": true }
    """
