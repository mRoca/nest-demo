import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';
import { PromoCode } from '@/promocode/domain/models/PromoCode';
import { Advantage } from '@/promocode/domain/models/Advantage';
import RestrictionRuleDenormalizer from '@/promocode/domain/factories/RestrictionRuleDenormalizer';
import { Name } from '@/promocode/domain/models/Name';
import { UUID } from '@/promocode/domain/models/UUID';
import { restrictionsExample } from '@/promocode/infrastructure/primary/dto/restrictions.example';
import { Type } from 'class-transformer';
import PromoCodeAdvantage from '@/promocode/infrastructure/primary/dto/PromoCodeAdvantage';

export default class PromoCodeCreationBody {
  @ApiProperty({
    description: 'PromoCode unique name',
    example: restrictionsExample.name + '-' + UUID.create().value,
  })
  @IsString()
  public readonly name: string;

  @ApiProperty({
    description: 'The promotion percentage',
    example: restrictionsExample.advantage,
  })
  @IsObject()
  @Type(() => PromoCodeAdvantage)
  @ValidateNested()
  public readonly advantage: PromoCodeAdvantage;

  @ApiProperty({
    description: 'Restrictions rules. See documentation',
    example: restrictionsExample.restrictions,
    type: 'object',
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  public readonly restrictions: object[];

  toDomain(): PromoCode {
    return new PromoCode({
      id: UUID.create(),
      name: new Name(this.name),
      advantage: new Advantage(this.advantage.percent),
      restrictions: new RestrictionRuleDenormalizer().createFromArray(
        this.restrictions,
      ),
    });
  }
}
