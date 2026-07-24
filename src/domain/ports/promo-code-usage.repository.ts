/**
 * Puerto de persistencia para el historial de aplicaciones de un código.
 */
export interface PromoCodeUsageRepository {
  countPaidUsagesByUser(promoCodeId: string, userId: string): number;
  countPaidUsagesGlobal(promoCodeId: string): number;
  sumPaidDiscountAmount(promoCodeId: string): number;
  recordPaidUsage(promoCodeId: string, userId: string, discountAmount: number): void;
}

export const PROMO_CODE_USAGE_REPOSITORY = Symbol('PROMO_CODE_USAGE_REPOSITORY');