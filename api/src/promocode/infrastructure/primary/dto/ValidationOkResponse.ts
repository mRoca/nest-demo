import { PromoCode } from '@/promocode/domain/models/PromoCode';
import { ApiProperty } from '@nestjs/swagger';
import PromoCodeAdvantage from '@/promocode/infrastructure/primary/dto/PromoCodeAdvantage';

export default class ValidationOkResponse {
  @ApiProperty({ description: 'Unique name of the promo code' })
  public readonly promocode_name: string;

  @ApiProperty({ description: 'accepted' })
  public readonly status: string = 'accepted';

  @ApiProperty()
  public readonly advantage: PromoCodeAdvantage;

  constructor(name: string, advantagePercent: number) {
    this.promocode_name = name;
    this.advantage = { percent: advantagePercent };
  }

  static fromPromoCode(code: PromoCode): ValidationOkResponse {
    return new ValidationOkResponse(
      code.name.value,
      code.advantage.reductionPercentage,
    );
  }
}
