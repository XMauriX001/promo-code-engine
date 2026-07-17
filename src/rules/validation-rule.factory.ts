import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ValidationRuleInterface } from '../contracts/validation-rule.interface';
import { ConfiguredRule } from '../domain/entities/promo-code';
import { CATEGORY_HIERARCHY } from 'src/domain/ports/category-hierarchy.port';
import type { CategoryHierarchy } from 'src/domain/ports/category-hierarchy.port';
import { PROMO_CODE_USAGE_REPOSITORY } from 'src/domain/ports/promo-code-usage.repository';
import type { PromoCodeUsageRepository } from 'src/domain/ports/promo-code-usage.repository';

import { MinPurchaseRule } from './configurable/min-purchase.rule';
import { EligibleCategoriesRule } from './configurable/eligible-categories.rule';
import { FirstOrderOnlyRule } from './configurable/first-order-only.rule';
import { UserUsageLimitRule } from './configurable/user-usage-limit.rule';
import { GlobalUsageLimitRule } from './configurable/global-usage-limit.rule';
import { GlobalAmountLimitRule } from './configurable/global-amount-limit.rule';
import { RestrictedUsageRule } from './configurable/restricted-usage.rule';

type RuleBuilder = (params: Record<string, unknown>) => ValidationRuleInterface;


@Injectable()
export class ValidationRuleFactory {
  private readonly registry = new Map<string, RuleBuilder>();

  constructor(
    @Inject(CATEGORY_HIERARCHY) private readonly categoryHierarchy: CategoryHierarchy,
    @Inject(PROMO_CODE_USAGE_REPOSITORY) private readonly usageRepository: PromoCodeUsageRepository,
  ) {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.register(
      'min_purchase_amount',
      (params) => new MinPurchaseRule(params as { amount: number }),
    );

    this.register(
      'eligible_categories',
      (params) =>
        new EligibleCategoriesRule(
          params as { categoryIds: string[] },
          this.categoryHierarchy,
        ),
    );

    this.register('first_order_only', () => new FirstOrderOnlyRule());

    this.register(
      'user_usage_limit',
      (params) =>
        new UserUsageLimitRule(params as { limit: number }, this.usageRepository),
    );

    this.register(
      'global_usage_limit',
      (params) =>
        new GlobalUsageLimitRule(params as { limit: number }, this.usageRepository),
    );

    this.register(
      'global_amount_limit',
      (params) =>
        new GlobalAmountLimitRule(params as { amount: number }, this.usageRepository),
    );

    this.register('restricted_usage', () => new RestrictedUsageRule());
  }

  register(key: string, builder: RuleBuilder): void {
    this.registry.set(key, builder);
  }

  create(configuredRule: ConfiguredRule): ValidationRuleInterface {
    const builder = this.registry.get(configuredRule.key);
    if (!builder) {
      throw new Error(`No hay regla registrada para la clave: ${configuredRule.key}`);
    }
    return builder(configuredRule.params);
  }

  createAll(configuredRules: ConfiguredRule[]): ValidationRuleInterface[] {
    return configuredRules.map((r) => this.create(r));
  }
}