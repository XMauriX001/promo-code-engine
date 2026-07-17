import { Injectable } from '@nestjs/common';
import { PromoCode } from '../../domain/entities/promo-code';
import { ValidationResult } from '../../domain/validation.result';
import { ValidationRuleInterface } from 'src/contracts/validation-rule.interface';
import { OrderableInterface } from 'src/contracts/orderable.interface';
import { ErrorCode } from 'src/domain/error-code';
import type { CategoryHierarchy } from 'src/domain/ports/category-hierarchy.port';

/**
 * Regla configurable: categorías elegibles para el código.
 */

@Injectable()
export class EligibleCategoriesRule implements ValidationRuleInterface {
  constructor(
    private readonly params: { categoryIds: string[] },
    private readonly categoryHierarchy: CategoryHierarchy,
  ) {}

  validate(_code: PromoCode | null, order: OrderableInterface): ValidationResult {
    const { categoryId } = order.getOrderContext();
    const isEligible = this.categoryHierarchy.isWithin(categoryId, this.params.categoryIds);
    if (!isEligible) {
      return ValidationResult.fail(ErrorCode.INVALID_CODE);
    }
    return ValidationResult.ok();
  }
}