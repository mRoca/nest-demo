import RestrictionRule from '@/promocode/domain/models/rules/RestrictionRule';
import RestrictionRuleCreationException from '@/promocode/domain/exceptions/RestrictionRuleNormalizationException';
import RestrictionRuleNormalizationException from '@/promocode/domain/exceptions/RestrictionRuleNormalizationException';
import And from '@/promocode/domain/models/rules/And';
import { isArray, isDefined, isInstance } from 'class-validator';
import Or from '@/promocode/domain/models/rules/Or';
import AgeComparator from '@/promocode/domain/models/rules/AgeComparator';
import WeatherChecker from '@/promocode/domain/models/rules/WeatherChecker';

export default class RestrictionRuleNormalizer {
  toArray(rule: RestrictionRule): object[] {
    if (!isInstance(rule, And)) {
      throw new RestrictionRuleNormalizationException(
        'Only And rules can be transformed into array',
      );
    }

    const result = this.toObject(rule);
    if (!isArray(result?.['and'])) {
      throw new RestrictionRuleNormalizationException(
        'Unable to get normalized And rules',
      );
    }

    return result['and'];
  }

  toObject(rule: RestrictionRule): object {
    if (!isInstance(rule, RestrictionRule)) {
      throw new RestrictionRuleNormalizationException(
        'Only RestrictionRule can be normalized',
      );
    }

    const ruleName = rule._name.value;

    if (typeof this[ruleName] !== 'function') {
      throw new RestrictionRuleCreationException(
        `Unknown rule name '${ruleName}' for rule '${rule._type}'`,
      );
    }

    return { [rule._name.value]: this[ruleName](rule) };
  }

  age(rule: AgeComparator): object {
    return { ...rule.rules };
  }

  and(rule: And): object {
    return rule.rules.map((item) => this.toObject(item));
  }

  date(rule: AgeComparator): object {
    return {
      after: this.parseTimestamp(rule.rules.gt),
      before: this.parseTimestamp(rule.rules.lt),
    };
  }

  or(rule: Or): object {
    return rule.rules.map((item) => this.toObject(item));
  }

  weather(rule: WeatherChecker): object {
    return {
      is: rule.expectedWeather,
      temp: { ...rule.temperatureChecker.rules },
    };
  }

  private parseTimestamp(time?: number): string | undefined {
    if (!isDefined(time)) {
      return undefined;
    }

    return new Date(time).toISOString().split('T')[0];
  }
}
