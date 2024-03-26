import { IsInt, IsString } from 'class-validator';

export class ValidationRequestBaseData {
  @IsInt()
  public readonly age: number;

  @IsString()
  public readonly town: string;

  constructor(age: number, town: string) {
    this.age = age;
    this.town = town;
  }
}
