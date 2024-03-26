import CurrentWeatherData from '@/promocode/domain/models/CurrentWeatherData';

export default abstract class WeatherProviderPort {
  abstract getWeatherForCity(town: string): Promise<CurrentWeatherData>;
}
