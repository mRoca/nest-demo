import { UUID } from '@/promocode/domain/models/UUID';
import { Name } from '@/promocode/domain/models/Name';
import { Advantage } from '@/promocode/domain/models/Advantage';
import RulesList from '@/promocode/domain/models/rules/RulesList';
import ValidationRequestData from '@/promocode/domain/models/ValidationRequestData';
import ValidationRequestContext from '@/promocode/domain/models/ValidationRequestContext';
import { IsInstance } from 'class-validator';
import { assertIsValid } from '@/shared/domain/assertions/Assert';
import { RuleName } from '@/promocode/domain/models/rules/RuleName';

export class PromoCode {
  @IsInstance(UUID)
  public readonly id: UUID;

  @IsInstance(Name)
  public readonly name: Name;

  @IsInstance(Advantage)
  public readonly advantage: Advantage;

  @IsInstance(RulesList)
  public readonly restrictions: RulesList;

  constructor(builder: {
    id: UUID;
    name: Name;
    advantage: Advantage;
    restrictions: RulesList;
  }) {
    this.id = builder.id;
    this.name = builder.name;
    this.advantage = builder.advantage;
    this.restrictions = builder.restrictions;
    assertIsValid(this);
  }

  validateRequest(data: ValidationRequestData): void {
    this.restrictions.validateRequest(
      data,
      new ValidationRequestContext([new RuleName('root')]),
    );
  }
}
