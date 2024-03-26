import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app/AppModule';
import { INestApplication } from '@nestjs/common';
import { Server } from 'node:http';
import FakeWeatherProvider from '@/promocode/infrastructure/secondary/weather/FakeWeatherProvider';
import WeatherProviderPort from '@/promocode/domain/ports/WeatherProviderPort';

export const initApp = async (
  initAppCallback?: (nestApp: INestApplication) => Promise<void>,
): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(WeatherProviderPort)
    .useClass(FakeWeatherProvider)
    .compile();

  const nestApp = moduleFixture.createNestApplication();

  if (initAppCallback) {
    await initAppCallback(nestApp);
  }

  await nestApp.init();
  return nestApp;
};

let app: INestApplication;

export const withHttpServer = (
  initAppCallback?: (nestApp: INestApplication) => Promise<void>,
): void => {
  beforeAll(async () => {
    if (!app) {
      app = await initApp(initAppCallback);
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
      app = undefined;
    }
  });
};

export const appHttpServer = (): Server => {
  if (!app) {
    throw new Error('Please run initApp in a BeforeAll step.');
  }
  return app.getHttpServer();
};
