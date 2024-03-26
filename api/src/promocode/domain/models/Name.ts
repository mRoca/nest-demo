import { assertIsValid } from '@/shared/domain/assertions/Assert';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class Name {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
    assertIsValid(this);
  }
}
