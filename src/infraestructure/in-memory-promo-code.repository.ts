import { Injectable } from '@nestjs/common';
import { PromoCode } from '../domain/entities/promo-code';
import { PromoCodeRepository } from 'src/contracts/promo-code.repository';

@Injectable()
export class InMemoryPromoCodeRepository implements PromoCodeRepository {
  private readonly codes = new Map<string, PromoCode>();


  seed(promoCode: PromoCode): void {
    this.codes.set(promoCode.code, promoCode);
  }

  findByCode(code: string): PromoCode | null {
    return this.codes.get(code) ?? null;
  }
}