import { Module } from '@nestjs/common';

import { CodeExistsRule } from './rules/fixed/code-exists.rule';
import { CodeTemporalValidityRule } from './rules/fixed/code-temporal-validity.rule';
import { CodeActiveStatusRule } from './rules/fixed/code-active-status.rule';


import { ValidationRuleFactory } from './rules/validation-rule.factory';
import { DiscountStrategyFactory } from './strategies/discount-strategy.factory';

import { FixedDiscountStrategy } from './strategies/fixed-discount.strategy';
import { PercentDiscountStrategy } from './strategies/percent-discount.strategy';
import { TieredDiscountStrategy } from './strategies/tiered-discount.strategy';

import { PromoCodeEngine } from './engine/promo-code-engine.service';

import { PROMO_CODE_REPOSITORY } from './contracts/promo-code.repository';
import { PROMO_CODE_USAGE_REPOSITORY } from './domain/ports/promo-code-usage.repository';
import { CATEGORY_HIERARCHY } from './domain/ports/category-hierarchy.port';


import { InMemoryPromoCodeRepository } from './infraestructure/in-memory-promo-code.repository';
import { InMemoryPromoCodeUsageRepository } from './infraestructure/in-memory-promo-code-usage.repository';
import { InMemoryCategoryHierarchy } from './infraestructure/in-memory-category-hierarchy';

import { PromoCodesController } from './controllers/promo-codes.controller';

import { PromoCodesSeedService } from './seeders/promo-codes-seed.service';

@Module({
  controllers: [PromoCodesController],
  providers: [
    // Reglas fijas, singletons estables
    CodeExistsRule,
    CodeActiveStatusRule,

    {
      provide: CodeTemporalValidityRule,
      useFactory: () => new CodeTemporalValidityRule(),
    },

    // Estrategias concretas
    FixedDiscountStrategy,
    PercentDiscountStrategy,
    TieredDiscountStrategy,

    // Factories
    ValidationRuleFactory,
    DiscountStrategyFactory,

    // Engine
    PromoCodeEngine,


    { provide: PROMO_CODE_REPOSITORY, useClass: InMemoryPromoCodeRepository },
    { provide: PROMO_CODE_USAGE_REPOSITORY, useClass: InMemoryPromoCodeUsageRepository },
    { provide: CATEGORY_HIERARCHY, useClass: InMemoryCategoryHierarchy },
    { provide: PromoCodesSeedService, useClass: PromoCodesSeedService },


    InMemoryPromoCodeUsageRepository,
    InMemoryCategoryHierarchy,
  ],
})
export class PromoCodesModule {}