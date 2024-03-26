import { IsInstance, IsOptional, ValidateNested } from 'class-validator';
import { assertIsValid } from '@/shared/domain/assertions/Assert';
import CurrentWeatherData from '@/promocode/domain/models/CurrentWeatherData';
import { ValidationRequestBaseData } from '@/promocode/domain/models/ValidationRequestBaseData';

export default class ValidationRequestData extends ValidationRequestBaseData {
  @IsOptional()
  @IsInstance(CurrentWeatherData)
  @ValidateNested()
  public readonly currentWeather: CurrentWeatherData;

  constructor(builder: {
    age: number;
    town: string;
    currentWeather?: CurrentWeatherData;
  }) {
    super(builder.age, builder.town);
    this.currentWeather = builder.currentWeather;
    assertIsValid(this);
  }
}
