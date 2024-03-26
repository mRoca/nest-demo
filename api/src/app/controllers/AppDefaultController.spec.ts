import * as request from 'supertest';
import { appHttpServer, withHttpServer } from '@test/httpUtils';

describe('AppDefaultController', () => {
  withHttpServer();

  // All important e2e tests are made in .feature files
  it('GET /favicon.ico', () => {
    return request(appHttpServer()).get('/favicon.ico').expect(204);
  });
});
