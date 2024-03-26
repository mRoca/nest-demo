import { IsNumber, IsString, Max, Min } from 'class-validator';
import { assertIsValid } from '@/shared/domain/assertions/Assert';

export default class CurrentWeatherData {
  @IsString()
  // See https://openweathermap.org/weather-conditions for available data
  public readonly description: string;

  @IsNumber()
  @Min(-100)
  @Max(100)
  public readonly temperatureCelsius: number;

  constructor(description: string, temperatureCelsius: number) {
    this.description = description;
    this.temperatureCelsius = temperatureCelsius;
    assertIsValid(this);
  }
}
