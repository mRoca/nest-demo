import OpenWeatherMapProvider from '@/promocode/infrastructure/secondary/weather/OpenWeatherMapProvider';
import CurrentWeatherData from '@/promocode/domain/models/CurrentWeatherData';
import WeatherProviderException from '@/promocode/domain/exceptions/WeatherProviderException';
import { Logger } from '@nestjs/common';

const lyonCoordinatesResponse = [
  {
    name: 'Lyon',
    local_names: { la: 'Lugdunum' },
    lat: 45.7578137,
    lon: 4.8320114,
    country: 'FR',
    state: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Lyon',
    local_names: { ar: 'ليون', fr: 'Lyon', gl: 'Lión' },
    lat: 45.6963425,
    lon: 4.735948029916814,
    country: 'FR',
    state: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Lyon',
    lat: 34.2178865,
    lon: -90.5420429,
    country: 'US',
    state: 'Mississippi',
  },
  {
    name: 'Lyon',
    lat: 38.5117175,
    lon: -91.1740394,
    country: 'US',
    state: 'Missouri',
  },
];

const lyonWeatherResponse = {
  coord: { lon: 4.832, lat: 45.7578 },
  weather: [
    { id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03n' },
  ],
  base: 'stations',
  main: {
    temp: 8.07,
    feels_like: 5.57,
    temp_min: 5.99,
    temp_max: 9.42,
    pressure: 1001,
    humidity: 80,
  },
  visibility: 10000,
  wind: { speed: 4.12, deg: 180 },
  clouds: { all: 32 },
  dt: 1710107228,
  sys: {
    type: 1,
    id: 6505,
    country: 'FR',
    sunrise: 1710050545,
    sunset: 1710092372,
  },
  timezone: 3600,
  id: 8015556,
  name: 'Vieux Lyon',
  cod: 200,
};

const mockFetchSuccess = () => {
  global.fetch = jest.fn((url) =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve(
          (url as string).includes('/weather')
            ? lyonWeatherResponse
            : lyonCoordinatesResponse,
        ),
    } as Response),
  );
};

const mockFetchError = () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: 'foo' }),
    } as Response),
  );
};

describe('OpenWeatherMapProvider', () => {
  const provider = new OpenWeatherMapProvider('foo');
  Logger.overrideLogger(false); // Hide logs

  test('should succeed at retrieving weather for a given city', async () => {
    mockFetchSuccess();

    const result = await provider.getWeatherForCity('lyon');
    expect(result).toBeInstanceOf(CurrentWeatherData);
    expect(result.description).toEqual('clouds');
    expect(result.temperatureCelsius).toEqual(8.07);

    expect(global.fetch).toHaveBeenCalledTimes(2);

    // Testing the coordinates cache: only the second request should run twice
    await provider.getWeatherForCity('lyon');
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  test('should throw if the http request fails', async () => {
    mockFetchError();
    expect.assertions(1);

    await expect(provider.getWeatherForCity('lyon')).rejects.toBeInstanceOf(
      WeatherProviderException,
    );
  });

  // TODO Add all other error tests
});
