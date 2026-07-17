import { Injectable, OnModuleInit } from '@nestjs/common';
import { InMemoryPromoCodeRepository } from '../infraestructure/in-memory-promo-code.repository';
import { InMemoryCategoryHierarchy } from '../infraestructure/in-memory-category-hierarchy';
import { PromoCode } from '../domain/entities/promo-code';


@Injectable()
export class PromoCodesSeedService implements OnModuleInit {
  constructor(
    private readonly promoCodeRepository: InMemoryPromoCodeRepository,
    private readonly categoryHierarchy: InMemoryCategoryHierarchy,
  ) {}

  onModuleInit(): void {
    this.promoCodeRepository.seed(
      new PromoCode({
        id: 'promo-demo-1',
        code: 'BLACKFRIDAY10',
        type: 'percent',
        value: 10,
        status: 'active',
        startDate: new Date('2026-01-01T00:00:00Z'),
        endDate: new Date('2026-12-31T23:59:59Z'),
        rules: [{ key: 'min_purchase_amount', params: { amount: 30 } }],
        maxDiscountAmount: 50,
      }),
    );

    this.categoryHierarchy.seed('services-root', ['digital-services', 'consulting']);
  }
}