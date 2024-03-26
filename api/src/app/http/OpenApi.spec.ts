import { appHttpServer, withHttpServer } from '@test/httpUtils';
import bootstrapOpenApiEndpoint from '@/app/http/OpenApi';
import * as request from 'supertest';

describe('OpenApi', () => {
  withHttpServer(bootstrapOpenApiEndpoint);

  test('should expose the HTML documentation', async () => {
    await request(appHttpServer())
      .get('/_doc/')
      .expect(200, /.*<title>Swagger UI<\/title>.*/)
      .set('Accept', 'text/html');

    await request(appHttpServer())
      .get('/_doc/swagger-ui-init.js')
      .expect(200, /.*"operationId": "AppDefaultController_home",.*/)
      .set('Accept', 'text/html');
  });

  test('should expose a JSON endpoint', async () => {
    await request(appHttpServer())
      .get('/_doc-json')
      .expect((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.info).toEqual({
          title: 'API documentation',
          version: '1.0',
          description: '',
          contact: {},
        });
        expect(response.body.paths['/health']).toEqual({
          get: {
            operationId: 'AppDefaultController_health',
            summary: 'Healthcheck endpoint',
            tags: ['Default'],
            parameters: [],
            responses: {
              '200': {
                description: '',
              },
            },
          },
        });
      });
  });

  test('should expose a YAML endpoint', async () => {
    await request(appHttpServer())
      .get('/_doc-yaml')
      .set('Accept', 'text/yaml')
      .expect((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toContain('title: API documentation');
        expect(response.text).toContain(
          'operationId: AppDefaultController_health',
        );
      });
  });
});
