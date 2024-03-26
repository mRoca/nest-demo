import { ApiProperty } from '@nestjs/swagger';
import { restrictionsExample } from '@/promocode/infrastructure/primary/dto/restrictions.example';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidationRequestBaseData } from '@/promocode/domain/models/ValidationRequestBaseData';

class ValidationBodyArguments {
  @ApiProperty({ description: 'Age of the customer', example: 20 })
  @IsNumber()
  @Min(0)
  @Max(200)
  public readonly age: number;

  @ApiProperty({
    description: 'Current town to test the code against',
    example: 'Lyon',
  })
  @IsString()
  @IsNotEmpty()
  public readonly town: string;
}

export default class ValidationBody {
  @ApiProperty({
    description: 'PromoCode unique name',
    example: restrictionsExample.name,
  })
  @IsString()
  public readonly promocode_name: string;

  @ApiProperty({
    description: "The current user's required informations",
    example: { age: 25, town: 'Lyon' },
  })
  @IsObject()
  @Type(() => ValidationBodyArguments)
  @ValidateNested()
  public readonly arguments: ValidationBodyArguments;

  toDomainValidationData(): ValidationRequestBaseData {
    return new ValidationRequestBaseData(
      this.arguments.age,
      this.arguments.town,
    );
  }
}
