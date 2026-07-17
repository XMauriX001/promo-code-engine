import { Injectable, Inject } from '@nestjs/common';
import { ValidationResult } from 'src/domain/validation.result';
import { OrderableInterface } from 'src/contracts/orderable.interface';
import { ValidationRuleInterface } from 'src/contracts/validation-rule.interface';
import { ValidationRuleFactory } from '../rules/validation-rule.factory';
import { PROMO_CODE_REPOSITORY } from 'src/contracts/promo-code.repository';
import type { PromoCodeRepository } from 'src/contracts/promo-code.repository';
import { DiscountStrategyFactory } from 'src/strategies/discount-strategy.factory';

import { CodeExistsRule } from '../rules/fixed/code-exists.rule';
import { CodeTemporalValidityRule } from '../rules/fixed/code-temporal-validity.rule';
import { CodeActiveStatusRule } from '../rules/fixed/code-active-status.rule';

/**
 * Orquestador del flujo de validación 
 */

@Injectable()
export class PromoCodeEngine {
  private readonly fixedRules: ValidationRuleInterface[];

  constructor(
    @Inject(PROMO_CODE_REPOSITORY) private readonly promoCodeRepository: PromoCodeRepository,
    private readonly validationRuleFactory: ValidationRuleFactory,
    private readonly discountStrategyFactory: DiscountStrategyFactory,
    codeExistsRule: CodeExistsRule,
    codeTemporalValidityRule: CodeTemporalValidityRule,
    codeActiveStatusRule: CodeActiveStatusRule,
  ) {
    this.fixedRules = [codeExistsRule, codeTemporalValidityRule, codeActiveStatusRule];
  }

  /**
   * Fase 1 — Verificación
   */
  validate(codeString: string, order: OrderableInterface): ValidationResult {
    const promoCode = this.promoCodeRepository.findByCode(codeString);

    for (const rule of this.fixedRules) {
      const result = rule.validate(promoCode, order);
      if (!result.isValid) return result;
    }

    const configuredRules = this.validationRuleFactory.createAll(promoCode!.rules);
    for (const rule of configuredRules) {
      const result = rule.validate(promoCode, order);
      if (!result.isValid) return result;
    }

    return ValidationResult.ok();
  }

  /**
   * Fase 2 — Cálculo 
   */
  calculateDiscount(codeString: string, order: OrderableInterface): number {
    const promoCode = this.promoCodeRepository.findByCode(codeString);
    if (!promoCode) {
      throw new Error(`No se puede calcular descuento: código '${codeString}' no encontrado`);
    }

    const strategy = this.discountStrategyFactory.create(promoCode);
    return strategy.calculate(promoCode, order.getSubtotal(), order.getOrderContext());
  }
}