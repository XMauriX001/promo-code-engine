import { PromoCode } from '../domain/entities/promo-code';

/**
 * Puerto de persistencia para resolver un código promocional a su entidad.
 */

export interface PromoCodeRepository {
  save(promoCodeData: any): unknown;
  findByCode(code: string): PromoCode | null;
}

export const PROMO_CODE_REPOSITORY = Symbol('PROMO_CODE_REPOSITORY');