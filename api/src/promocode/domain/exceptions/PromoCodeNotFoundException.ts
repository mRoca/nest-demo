import { Name } from '@/promocode/domain/models/Name';

export default class PromoCodeNotFoundException extends Error {
  constructor(name: Name) {
    super(`No PromoCode with name ${name.value} found`);
  }
}
