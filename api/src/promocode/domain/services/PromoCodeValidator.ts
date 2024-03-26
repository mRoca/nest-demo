import { Injectable } from '@nestjs/common';
import ValidationRequestDataBuilder from '@/promocode/domain/services/ValidationRequestDataBuilder';
import { PromoCode } from '@/promocode/domain/models/PromoCode';
import { ValidationRequestBaseData } from '@/promocode/domain/models/ValidationRequestBaseData';

@Injectable()
export default class PromoCodeValidator {
  constructor(
    private readonly requestDataBuilder: ValidationRequestDataBuilder,
  ) {}

  async validate(
    promoCode: PromoCode,
    args: ValidationRequestBaseData,
  ): Promise<void> {
    // Get all additional context data (current weather, ...)
    const data = await this.requestDataBuilder.buildRequestData(args);
    // Throw a ValidateRequestException if any error occurs
    promoCode.validateRequest(data);
  }
}
