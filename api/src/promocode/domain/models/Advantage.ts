import { assertIsValid } from '@/shared/domain/assertions/Assert';
import { IsInt, IsPositive } from 'class-validator';

export class Advantage {
  @IsInt()
  @IsPositive()
  public readonly reductionPercentage: number;

  constructor(reductionPercentage: number) {
    this.reductionPercentage = reductionPercentage;
    assertIsValid(this);
  }
}
