import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { PromoCode } from '@/promocode/domain/models/PromoCode';
import RestrictionRuleNormalizer from '@/promocode/domain/factories/RestrictionRuleNormalizer';
import { UUID } from '@/promocode/domain/models/UUID';
import { Name } from '@/promocode/domain/models/Name';
import RestrictionRuleDenormalizer from '@/promocode/domain/factories/RestrictionRuleDenormalizer';
import { Advantage } from '@/promocode/domain/models/Advantage';

@Entity({ name: 'promocodes' })
export class PromoCodeEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  declare id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  declare name: string;

  @Column({ type: 'int' })
  declare reductionPercentage: number;

  @Column({ type: 'json' })
  declare restrictions: object[];

  static fromDomain(code: PromoCode): PromoCodeEntity {
    const entity = new PromoCodeEntity();
    entity.id = code.id.value;
    entity.name = code.name.value;
    entity.reductionPercentage = code.advantage.reductionPercentage;
    entity.restrictions = new RestrictionRuleNormalizer().toArray(
      code.restrictions,
    );

    return entity;
  }

  toDomain(): PromoCode {
    return new PromoCode({
      id: new UUID(this.id),
      name: new Name(this.name),
      advantage: new Advantage(this.reductionPercentage),
      restrictions: new RestrictionRuleDenormalizer().createFromArray(
        this.restrictions,
      ),
    });
  }
}
