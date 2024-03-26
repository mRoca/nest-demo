import { Injectable } from '@nestjs/common';
import WeatherProviderPort from '@/promocode/domain/ports/WeatherProviderPort';
import CurrentWeatherData from '@/promocode/domain/models/CurrentWeatherData';

/**
 * This class allows to use the project without any internet connexion or any valid auth token.
 *
 */
@Injectable()
export default class FakeWeatherProvider implements WeatherProviderPort {
  async getWeatherForCity(city: string): Promise<CurrentWeatherData> {
    if (
      ['lyon', 'montpellier', 'marseille'].includes(city.trim().toLowerCase())
    ) {
      return new CurrentWeatherData('clear', 30);
    }

    return new CurrentWeatherData('rain', 10);
  }
}
