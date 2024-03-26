import { Injectable, Logger } from '@nestjs/common';
import WeatherProviderPort from '@/promocode/domain/ports/WeatherProviderPort';
import CurrentWeatherData from '@/promocode/domain/models/CurrentWeatherData';
import { isArray, isDefined, isNumber } from 'class-validator';
import WeatherProviderException from '@/promocode/domain/exceptions/WeatherProviderException';
import { isString } from 'lodash';

type LatLonCoordinates = { lat: number; lon: number };

// TODO Persist the cache instead of keeping it in memory
const cachedCoordinates: Record<string, LatLonCoordinates> = {};

@Injectable()
export default class OpenWeatherMapProvider implements WeatherProviderPort {
  private logger: Logger;

  constructor(private readonly apiKey: string) {
    this.logger = new Logger('OpenWeather');
  }

  async getWeatherForCity(city: string): Promise<CurrentWeatherData> {
    const cityLocation = await this.getCityLocation(city);
    const currentWeather = await this.getWeatherByCoordinates(cityLocation);
    this.logger.debug(
      `Current weather for ${city}: ${JSON.stringify(currentWeather)}`,
    );

    return currentWeather;
  }

  private async getCityLocation(city: string): Promise<LatLonCoordinates> {
    if (isDefined(cachedCoordinates[city])) {
      return cachedCoordinates[city];
    }

    // See https://openweathermap.org/api/geocoding-api#direct_name_how
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${this.apiKey}`,
    );
    if (!response.ok) {
      this.logger.error(JSON.stringify(await response.json()));
      throw new WeatherProviderException(`Unable to retrieve city data`);
    }

    const matches: (object & LatLonCoordinates)[] = await response.json();

    if (!isArray(matches) || matches.length === 0) {
      throw new WeatherProviderException(
        `No coordinates results for city ${city}`,
      );
    }

    if (!isNumber(matches[0].lat) || !isNumber(matches[0].lon)) {
      throw new WeatherProviderException(
        `Badly formatted Open Weather API response for city ${city}`,
      );
    }

    if (matches.length > 1) {
      this.logger.log(
        `Many returned results for city ${city}, using the fist one`,
      );
    }

    cachedCoordinates[city] = { lat: matches[0].lat, lon: matches[0].lon };

    return cachedCoordinates[city];
  }

  private async getWeatherByCoordinates(
    cityLocation: LatLonCoordinates,
  ): Promise<CurrentWeatherData> {
    // See https://openweathermap.org/current#builtin
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${cityLocation.lat}&lon=${cityLocation.lon}&units=metric&appid=${this.apiKey}`,
    );
    if (!response.ok) {
      this.logger.error(JSON.stringify(await response.json()));
      throw new WeatherProviderException(`Unable to retrieve weather data`);
    }

    // NOTE: It is possible to meet more than one weather condition for a requested location. The first weather condition in API respond is primary
    const data: { weather: [{ main: string }]; main: { temp: number } } =
      await response.json();

    if (!isString(data?.weather?.[0]?.main) || !isNumber(data?.main?.temp)) {
      this.logger.error(JSON.stringify(data));
      throw new WeatherProviderException(
        `Badly formatted Open Weather API weather response`,
      );
    }

    return new CurrentWeatherData(
      data.weather[0].main.toLowerCase(),
      data.main.temp,
    );
  }
}
