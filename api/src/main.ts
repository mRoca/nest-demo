import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/AppModule';
import { Config, LOGGER_TYPE } from './Config';
import { JsonLogger } from '@/app/logger/JsonLogger';
import { ClsService } from 'nestjs-cls';
import bootstrapOpenApiEndpoint from '@/app/http/OpenApi';

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
  process.on(signal, (received) =>
    console.warn(`[Nest] Received signal: ${received}`),
  ),
);

process.on('unhandledRejection', (error) => {
  // Avoid the server to crash if a promise is rejected without await or catch()
  // You can test this handler by putting the following line in any Controller:
  // new Promise((_, reject) => (reject(new Error('unhandled rejection'))));
  console.error('Unhandled promise rejection, probably a missing await');
  console.error(error);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    bufferLogs: true, // Wait for the logger to be ready
  });

  if (Config.LOGGER === LOGGER_TYPE.JSON) {
    app.useLogger(new JsonLogger(undefined, app.get(ClsService)));
  }
  app.enableShutdownHooks();
  app.enableCors();
  await bootstrapOpenApiEndpoint(app);
  await app.listen(Config.HTTP_PORT);
}

bootstrap();
