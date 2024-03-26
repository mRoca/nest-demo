import WeatherProviderPort from '@/promocode/domain/ports/WeatherProviderPort';
import ValidationRequestData from '@/promocode/domain/models/ValidationRequestData';
import { Injectable } from '@nestjs/common';
import { ValidationRequestBaseData } from '@/promocode/domain/models/ValidationRequestBaseData';

@Injectable()
export default class ValidationRequestDataBuilder {
  constructor(private readonly weatherProvider: WeatherProviderPort) {}

  async buildRequestData(
    data: ValidationRequestBaseData,
  ): Promise<ValidationRequestData> {
    return new ValidationRequestData({
      ...data,
      currentWeather: await this.weatherProvider.getWeatherForCity(data.town),
    });
  }
}
