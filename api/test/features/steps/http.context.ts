import * as request from 'supertest';
import { appHttpServer } from '@test/httpUtils';

let bearerToken: string | undefined;
let lastResponse: request.Response | undefined;

export const withHttpContext = () => {
  afterEach(async () => {
    lastResponse = undefined;
    bearerToken = undefined;
  });
};

export const get = async (url: string): Promise<request.Response> => {
  const req = request(appHttpServer()).get(url);
  addBearerTokenToRequest(req);
  lastResponse = await req;
  return lastResponse;
};

export const post = async (
  url: string,
  data: string | Record<string, unknown> | unknown[],
): Promise<request.Response> => {
  const req = request(appHttpServer())
    .post(url)
    .set('Content-type', 'application/json');
  addBearerTokenToRequest(req);
  lastResponse = await req.send(data);
  return lastResponse;
};

export const put = async (
  url: string,
  data: string,
): Promise<request.Response> => {
  const req = request(appHttpServer())
    .put(url)
    .set('Content-type', 'application/json');
  addBearerTokenToRequest(req);
  lastResponse = await req.send(data);
  return lastResponse;
};

const addBearerTokenToRequest = (req: request.Request) => {
  if (bearerToken) {
    req.set('Authorization', `Bearer ${bearerToken}`);
  }
};

export const setBearerToken = (newToken: string): void => {
  bearerToken = newToken || undefined;
};

export const lastRequestResponse = (): request.Response => {
  if (!lastResponse) {
    throw new Error('No request was made');
  }
  return lastResponse;
};

export const theLastResponseStatusCodeShouldBe = (
  statusCode: number | string,
): void => {
  const response = lastRequestResponse();
  if (response.statusCode != statusCode) {
    console.error(response.body); // For debug purposes
  }
  expect(response.statusCode).toEqual(parseInt(statusCode as string));
};
