import { v4 as uuidv4 } from 'uuid';
import { assertIsValid } from '@/shared/domain/assertions/Assert';
import { IsUUID } from 'class-validator';

export class UUID {
  @IsUUID(4)
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
    assertIsValid(this);
  }

  static create(): UUID {
    return new UUID(uuidv4());
  }
}
