import { InjectRepository } from '@nestjs/typeorm';
import PromoCodeProviderPort from '@/promocode/domain/ports/PromoCodeProviderPort';
import { PromoCode } from '@/promocode/domain/models/PromoCode';
import { Repository } from 'typeorm';
import { Name } from '@/promocode/domain/models/Name';
import { PromoCodeEntity } from '@/promocode/infrastructure/secondary/database/PromoCodeEntity';
import PromoCodeNotFoundException from '@/promocode/domain/exceptions/PromoCodeNotFoundException';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class PromoCodeDatabaseProvider
  implements PromoCodeProviderPort
{
  constructor(
    @InjectRepository(PromoCodeEntity)
    private readonly repository: Repository<PromoCodeEntity>,
  ) {}

  async save(code: PromoCode): Promise<PromoCode> {
    const entity = PromoCodeEntity.fromDomain(code);
    const savedEntity = await this.repository.save(entity);
    return savedEntity.toDomain();
  }

  async existsByName(name: Name): Promise<boolean> {
    return this.repository.existsBy({ name: name.value });
  }

  async findByNameOrFail(name: Name): Promise<PromoCode> {
    const entity = await this.repository.findOneBy({ name: name.value });

    if (!entity) {
      throw new PromoCodeNotFoundException(name);
    }

    return entity.toDomain();
  }
}
