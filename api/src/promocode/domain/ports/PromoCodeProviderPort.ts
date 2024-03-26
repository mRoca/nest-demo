import { PromoCode } from '@/promocode/domain/models/PromoCode';
import { Name } from '@/promocode/domain/models/Name';

export default abstract class PromoCodeProviderPort {
  abstract existsByName(name: Name): Promise<boolean>;

  abstract save(code: PromoCode): Promise<PromoCode>;

  abstract findByNameOrFail(name: Name): Promise<PromoCode>;
}
