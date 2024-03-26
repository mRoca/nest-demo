
# Deploy in production (AWS)

A [copilot](https://aws.github.io/copilot-cli/docs/overview/) manifest is already included in the project and allows you to deploy the app in any AWS account:
- ECR (docker image registry)
- AppRunner (docker container runtime)
- Aurora Serverless v2 (Mysql)
- SSM (secrets manager)

> Copilot is really slow to create or remove a stack, but it's only because of CloudFormation ;-)

1. Install [Copilot CLI](https://aws.github.io/copilot-cli/docs/getting-started/install/)
2. Configure your [aws credentials](https://aws.github.io/copilot-cli/docs/credentials/)
3. (optional) Create a [OPEN_WEATHER_MAP_API_TOKEN secret](https://aws.github.io/copilot-cli/docs/developing/secrets/) and update the [manifest](../copilot/api/manifest.yml)
4. Deploy your app

```bash
copilot app init nest-demo
copilot env init --name testing
copilot env deploy --name testing
copilot deploy --all --init-wkld --env testing
```

5. Enjoy.

- You can see your [app's logs & status](https://aws.github.io/copilot-cli/docs/concepts/services/#whats-your-service-status): `copilot svc status`
- You can remove everything from your AWS account by running `copilot app delete`
