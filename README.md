# Nest DDD demo

This project is a working example using:
- [NestJS](https://docs.nestjs.com/) - API node framework
- [TypeORM](https://typeorm.io/) & MySQL - ORM for infrastructure primary layer
- [Jest](https://jestjs.io/) - JS tests
- [jest-cucumber](https://github.com/bencompton/jest-cucumber) - API e2e tests in Gherkin format
- [Docker](https://docs.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) - The dockerised local stack
- [Copilot for AWS](https://aws.github.io/copilot-cli/) - Stack deployment tool using ECS or AppRunner
- [Hexagonal Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)) & [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) for the PromoCode bounded context
- Gitlab CI for tests & coverage

## Summary

- [How to use this project locally (development)](./docs/DEVELOPMENT.md)
- [How to deploy project (prod)](./docs/PRODUCTION.md)
- Services
  - [PromoCode API & Domain](./docs/API_PROMOCODE.md)
  - [`TODO` If the project would have not been a fake demo](./docs/API_PROMOCODE.md#TODO-If-the-project-would-have-not-been-a-fake-demo)

