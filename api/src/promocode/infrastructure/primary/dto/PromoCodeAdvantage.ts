import { ApiProperty } from '@nestjs/swagger';
import { restrictionsExample } from '@/promocode/infrastructure/primary/dto/restrictions.example';
import { IsNumber } from 'class-validator';

export default class PromoCodeAdvantage {
  @ApiProperty({
    description: 'Reduction in percent',
    example: restrictionsExample.advantage.percent,
  })
  @IsNumber()
  public readonly percent: number;
}
