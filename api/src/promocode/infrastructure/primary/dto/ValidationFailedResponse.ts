import ValidateRequestException from '@/promocode/domain/exceptions/ValidateRequestException';
import { ApiProperty } from '@nestjs/swagger';

export default class ValidationFailedResponse {
  @ApiProperty({ description: 'Unique name of the promo code' })
  public readonly promocode_name: string;

  @ApiProperty({ description: 'denied' })
  public readonly status = 'denied';

  @ApiProperty({
    type: 'object',
    isArray: true,
    description: 'Reasons of the rejection',
  })
  public readonly reasons: object[];

  constructor(name: string, reasons: (Error | object)[]) {
    this.promocode_name = name;
    this.reasons = reasons.map((reason) => {
      if (reason instanceof ValidateRequestException) return reason.toJson();
      if (reason instanceof Error)
        return { type: reason.name, message: reason.message };
      return reason;
    });
  }

  // static notFoundPromoCode(promoCodeName: string): ValidationFailedResponse {
  //   return new ValidationFailedResponse(promoCodeName, [{message: 'PromoCode not found'}])
  // }

  static fromValidationException(
    promoCodeName: string,
    e: Error,
  ): ValidationFailedResponse {
    if (e instanceof ValidateRequestException) {
      return new ValidationFailedResponse(
        promoCodeName,
        e.getFlattenedErrors(),
      );
    }

    return new ValidationFailedResponse(promoCodeName, [e]);
  }
}
