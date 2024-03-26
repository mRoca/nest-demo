import { PromoCode } from '@/promocode/domain/models/PromoCode';
import { UUID } from '@/promocode/domain/models/UUID';
import { Name } from '@/promocode/domain/models/Name';
import { Advantage } from '@/promocode/domain/models/Advantage';
import {
  defaultFalsyRule,
  defaultTruthyRule,
  defaultValidationRequestData,
} from '@/promocode/domain/models/rules/Or.spec';
import RulesList from '@/promocode/domain/models/rules/RulesList';

const defaultUUID: UUID = new UUID('89af9a51-e988-45de-92e2-69445e00a926');
const defaultName = new Name('MyCode');
const defaultAdvantage = new Advantage(20);
const defaultTruthyRestrictions = new RulesList([defaultTruthyRule]);
const defaultFalsyRestrictions = new RulesList([defaultFalsyRule]);

export const defaultPromoCodeProps = {
  id: defaultUUID,
  name: defaultName,
  advantage: defaultAdvantage,
  restrictions: defaultTruthyRestrictions,
};

describe('PromoCode', () => {
  test('should instantiate', () => {
    const item = new PromoCode(defaultPromoCodeProps);
    expect(item.name.value).toEqual('MyCode');
  });

  test('should allow to validate a request', () => {
    const item = new PromoCode(defaultPromoCodeProps);
    expect(() =>
      item.validateRequest(defaultValidationRequestData),
    ).not.toThrow();
  });

  test('should fail to validate a bad request', () => {
    const item = new PromoCode({
      ...defaultPromoCodeProps,
      restrictions: defaultFalsyRestrictions,
    });
    expect(() => item.validateRequest(defaultValidationRequestData)).toThrow(
      'root.and: Not all conditions are valid',
    );
  });
});
