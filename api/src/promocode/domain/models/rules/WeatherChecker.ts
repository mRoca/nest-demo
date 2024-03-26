import RestrictionRule from '@/promocode/domain/models/rules/RestrictionRule';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';
import ValidationRequestData from '@/promocode/domain/models/ValidationRequestData';
import ValidationRequestContext from '@/promocode/domain/models/ValidationRequestContext';
import ValidateRequestException from '@/promocode/domain/exceptions/ValidateRequestException';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import TemperatureComparator from '@/promocode/domain/models/rules/TemperatureComparator';
import { assertIsValid } from '@/shared/domain/assertions/Assert';

export default class WeatherChecker extends RestrictionRule {
  @IsString()
  @IsOptional()
  public readonly expectedWeather?: string;

  @ValidateNested()
  @IsOptional()
  public readonly temperatureChecker?: TemperatureComparator;

  constructor(
    expectedWeather?: string,
    temperatureChecker?: TemperatureComparator,
  ) {
    super(new RuleName('weather'));
    this.expectedWeather = expectedWeather;
    this.temperatureChecker = temperatureChecker;
    assertIsValid(this);
  }

  validateRequest(
    data: ValidationRequestData,
    previousContext: ValidationRequestContext,
  ): void {
    const context = previousContext.withNewPathStep(this._name);

    if (typeof data.currentWeather === undefined) {
      throw new ValidateRequestException(
        'Unable to find the current weather data',
        context,
      );
    }

    const errors = [];
    if (
      this.expectedWeather !== undefined &&
      this.expectedWeather.toLowerCase() !==
        data.currentWeather.description.toLowerCase()
    ) {
      errors.push(
        new ValidateRequestException(
          `The current weather is: '${data.currentWeather.description}'`,
          context.withNewPathStep(new RuleName('is')),
        ),
      );
    }

    if (this.temperatureChecker !== undefined) {
      try {
        this.temperatureChecker.validateRequest(data, context);
      } catch (e: unknown) {
        errors.push(e);
      }
    }

    if (errors.length > 0) {
      throw new ValidateRequestException(
        'The weather does not match',
        context,
        errors,
      );
    }
  }
}
