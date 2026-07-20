import { Injectable } from '@nestjs/common';
import { PromoCode } from '../domain/entities/promo-code';
import { PromoCodeRepository } from 'src/contracts/promo-code.repository';

@Injectable()
export class InMemoryPromoCodeRepository implements PromoCodeRepository {
  private readonly codes = new Map<string, PromoCode>();

  save(promoCodeData: any): void {
    const promoCode = new PromoCode({
      id: promoCodeData.id ?? promoCodeData.code,
      code: promoCodeData.code,
      type: promoCodeData.type,
      value: promoCodeData.value,
      status: promoCodeData.status ?? 'active',
      startDate: new Date(promoCodeData.startDate),
      endDate: new Date(promoCodeData.endDate),
      rules: promoCodeData.rules ?? [],
      tiers: promoCodeData.tiers,
      restrictedUserIds: promoCodeData.restrictedUserIds,
      maxDiscountAmount: promoCodeData.maxDiscountAmount,
    });
    this.codes.set(promoCode.code, promoCode);
  }

  seed(promoCode: PromoCode): void {
    this.codes.set(promoCode.code, promoCode);
  }

  findByCode(code: string): PromoCode | null {
    return this.codes.get(code) ?? null;
  }
}