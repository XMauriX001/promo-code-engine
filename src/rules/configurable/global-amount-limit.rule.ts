import { Injectable } from '@nestjs/common';
import { PromoCode } from 'src/domain/entities/promo-code';
import { ValidationResult } from 'src/domain/validation.result';
import { ValidationRuleInterface } from 'src/contracts/validation-rule.interface';
import { OrderableInterface } from 'src/contracts/orderable.interface';
import { ErrorCode } from 'src/domain/error-code';
import type { PromoCodeUsageRepository } from 'src/domain/ports/promo-code-usage.repository';


/**
 * Regla configurable: límite de descuento acumulado otorgado por este código en toda la plataforma.
 */
@Injectable()
export class GlobalAmountLimitRule implements ValidationRuleInterface {
  constructor(
    private readonly params: { amount: number },
    private readonly usageRepository: PromoCodeUsageRepository,
  ) {}

  validate(code: PromoCode | null, _order: OrderableInterface): ValidationResult {
    if (!code) return ValidationResult.fail(ErrorCode.INVALID_CODE);

    const accumulated = this.usageRepository.sumPaidDiscountAmount(code.id);
    if (accumulated >= this.params.amount) {
      return ValidationResult.fail(ErrorCode.MAXIMUM_DISCOUNT_REACHED);
    }
    return ValidationResult.ok();
  }
}