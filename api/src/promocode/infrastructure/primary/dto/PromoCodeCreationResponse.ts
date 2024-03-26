import { PromoCode } from '@/promocode/domain/models/PromoCode';
import RestrictionRuleNormalizer from '@/promocode/domain/factories/RestrictionRuleNormalizer';
import { ApiProperty } from '@nestjs/swagger';
import PromoCodeAdvantage from '@/promocode/infrastructure/primary/dto/PromoCodeAdvantage';
import { restrictionsExample } from '@/promocode/infrastructure/primary/dto/restrictions.example';

export default class PromoCodeCreationResponse {
  @ApiProperty({ description: 'Unique ID of the promo code' })
  declare id: string;

  @ApiProperty({ description: 'Unique name of the promo code' })
  declare name: string;

  @ApiProperty({ description: 'Passed advantage value' })
  declare advantage: PromoCodeAdvantage;

  @ApiProperty({
    type: 'object',
    isArray: true,
    description: 'Restrictions rules. See documentation',
    example: restrictionsExample.restrictions,
  })
  declare restrictions: object[];

  static fromDomain(code: PromoCode): PromoCodeCreationResponse {
    const result = new PromoCodeCreationResponse();
    result.id = code.id.value;
    result.name = code.name.value;
    result.advantage = { percent: code.advantage.reductionPercentage };
    result.restrictions = new RestrictionRuleNormalizer().toArray(
      code.restrictions,
    );

    return result;
  }
}
