import RestrictionRuleNormalizer from '@/promocode/domain/factories/RestrictionRuleNormalizer';
import RestrictionRuleDenormalizer from '@/promocode/domain/factories/RestrictionRuleDenormalizer';
import { defaultPromoCodePayload } from '@/promocode/domain/factories/RestrictionRuleDenormalizer.spec';

describe('RestrictionRuleNormalizer', () => {
  const denormalizer = new RestrictionRuleDenormalizer();
  const normalizer = new RestrictionRuleNormalizer();

  test('should return a valid array', () => {
    // createFromArray has been tested in another spec
    const rule = denormalizer.createFromArray(
      defaultPromoCodePayload.restrictions,
    );
    const rawRule = normalizer.toArray(rule);
    expect(rawRule).toEqual(defaultPromoCodePayload.restrictions);
    expect(JSON.stringify(rawRule, null, 2)).toEqual(
      JSON.stringify(defaultPromoCodePayload.restrictions, null, 2),
    );
  });
});
