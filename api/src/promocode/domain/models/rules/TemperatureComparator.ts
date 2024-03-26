import NumberComparator, {
  NumberComparatorRules,
} from '@/promocode/domain/models/rules/NumberComparator';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';
import ValidationRequestData from '@/promocode/domain/models/ValidationRequestData';
import ValidationRequestContext from '@/promocode/domain/models/ValidationRequestContext';
import ValidateRequestException from '@/promocode/domain/exceptions/ValidateRequestException';

export default class TemperatureComparator extends NumberComparator {
  constructor(rules: NumberComparatorRules) {
    super(new RuleName('temp'), rules);
  }

  validateRequest(
    data: ValidationRequestData,
    context: ValidationRequestContext,
  ): void {
    if (typeof data.currentWeather?.temperatureCelsius === undefined) {
      throw new ValidateRequestException(
        'Unable to find the current weather data',
        context.withNewPathStep(this._name),
      );
    }
    if (!this.isValidAgainst(data.currentWeather.temperatureCelsius)) {
      throw new ValidateRequestException(
        `The current temperature is ${data.currentWeather.temperatureCelsius}°C`,
        context.withNewPathStep(this._name),
      );
    }
  }
}
