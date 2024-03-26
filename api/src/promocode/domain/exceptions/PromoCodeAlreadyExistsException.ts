import { Name } from '@/promocode/domain/models/Name';

export default class PromoCodeAlreadyExistsException extends Error {
  constructor(name: Name) {
    super(`A PromoCode with name ${name.value} already exists`);
  }
}
