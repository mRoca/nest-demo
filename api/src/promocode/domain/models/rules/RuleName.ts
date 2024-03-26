import { assertIsValid } from '@/shared/domain/assertions/Assert';
import { IsNotEmpty, IsString } from 'class-validator';

export class RuleName {
  @IsString()
  @IsNotEmpty()
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
    assertIsValid(this);
  }

  forIndex(index: number) {
    return new RuleName(`${this.value}[${index}]`);
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
