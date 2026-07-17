import { Injectable } from '@nestjs/common';
import { PromoCodeUsageRepository } from 'src/domain/ports/promo-code-usage.repository';

interface UsageRecord {
  promoCodeId: string;
  userId: string;
  discountAmount: number;
  paid: boolean;
}

@Injectable()
export class InMemoryPromoCodeUsageRepository implements PromoCodeUsageRepository {
  private readonly usages: UsageRecord[] = [];

  seed(record: UsageRecord): void {
    this.usages.push(record);
  }

  countPaidUsagesByUser(promoCodeId: string, userId: string): number {
    return this.usages.filter(
      (u) => u.promoCodeId === promoCodeId && u.userId === userId && u.paid,
    ).length;
  }

  countPaidUsagesGlobal(promoCodeId: string): number {
    return this.usages.filter((u) => u.promoCodeId === promoCodeId && u.paid).length;
  }

  sumPaidDiscountAmount(promoCodeId: string): number {
    return this.usages
      .filter((u) => u.promoCodeId === promoCodeId && u.paid)
      .reduce((sum, u) => sum + u.discountAmount, 0);
  }
}