import { PromoCode } from '@/promocode/domain/models/PromoCode';
import { Name } from '@/promocode/domain/models/Name';
import PromoCodeAlreadyExistsException from '@/promocode/domain/exceptions/PromoCodeAlreadyExistsException';
import PromoCodeProviderPort from '@/promocode/domain/ports/PromoCodeProviderPort';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class PromoCodeRepository {
  constructor(private readonly promoCodeProvider: PromoCodeProviderPort) {}

  async save(code: PromoCode): Promise<PromoCode> {
    if (await this.promoCodeProvider.existsByName(code.name)) {
      throw new PromoCodeAlreadyExistsException(code.name);
    }
    return this.promoCodeProvider.save(code);
  }

  findByName(name: Name): Promise<PromoCode> {
    return this.promoCodeProvider.findByNameOrFail(name);
  }
}
