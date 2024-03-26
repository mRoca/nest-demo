import RestrictionRule from '@/promocode/domain/models/rules/RestrictionRule';
import RestrictionRuleDenormalizationException from '@/promocode/domain/exceptions/RestrictionRuleNormalizationException';
import And from '@/promocode/domain/models/rules/And';
import { isArray, isDefined, isObject } from 'class-validator';
import Or from '@/promocode/domain/models/rules/Or';
import AgeComparator from '@/promocode/domain/models/rules/AgeComparator';
import { NumberComparatorRules } from '@/promocode/domain/models/rules/NumberComparator';
import WeatherChecker from '@/promocode/domain/models/rules/WeatherChecker';
import TemperatureComparator from '@/promocode/domain/models/rules/TemperatureComparator';
import CurrentDateComparator, {
  DateComparatorRules,
} from '@/promocode/domain/models/rules/CurrentDateComparator';
import RulesList from '@/promocode/domain/models/rules/RulesList';

export default class RestrictionRuleDenormalizer {
  createFromArray(data: object[]): RulesList {
    const and = this.createFromObject({ and: data }) as And;
    return new RulesList(and.rules);
  }

  createFromObject(data: object): RestrictionRule {
    if (Object.keys(data).length !== 1) {
      throw new RestrictionRuleDenormalizationException(
        'Invalid object, only one key should be provided',
      );
    }

    const ruleName = Object.keys(data)[0];

    if (typeof this[ruleName] !== 'function') {
      throw new RestrictionRuleDenormalizationException(
        `Unknown rule name '${ruleName}'`,
      );
    }

    return this[ruleName](data[ruleName]);
  }

  age(payload: unknown): AgeComparator {
    if (!isObject(payload)) {
      throw new RestrictionRuleDenormalizationException(
        `Invalid 'age' data: an object is required`,
      );
    }
    return new AgeComparator(new NumberComparatorRules(payload));
  }

  and(payload: unknown): And {
    if (!isArray(payload)) {
      throw new RestrictionRuleDenormalizationException(
        `Invalid 'and' data: an array is required`,
      );
    }
    return new And(payload.map((item) => this.createFromObject(item)));
  }

  date(payload: unknown): AgeComparator {
    if (!isObject(payload)) {
      throw new RestrictionRuleDenormalizationException(
        `Invalid 'date' data: an object is required`,
      );
    }
    return new CurrentDateComparator(
      new DateComparatorRules({
        before: this.parseDate((payload as { before?: string })?.before),
        after: this.parseDate((payload as { after?: string })?.after),
      }),
    );
  }

  or(payload: unknown): Or {
    if (!isArray(payload)) {
      throw new RestrictionRuleDenormalizationException(
        `Invalid 'or' data: an array is required`,
      );
    }
    return new Or(payload.map((item) => this.createFromObject(item)));
  }

  weather(payload: unknown): WeatherChecker {
    if (!isObject(payload)) {
      throw new RestrictionRuleDenormalizationException(
        `Invalid 'weather' data: an object is required`,
      );
    }
    return new WeatherChecker(
      (payload as { is?: string })?.is,
      new TemperatureComparator((payload as { temp?: object })?.temp),
    );
  }

  private parseDate(value?: string): Date | undefined {
    if (!isDefined(value)) {
      return undefined;
    }

    return new Date(value);
  }
}
