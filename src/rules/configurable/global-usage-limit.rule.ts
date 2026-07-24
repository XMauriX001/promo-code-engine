import { Injectable } from '@nestjs/common';
import { PromoCode } from 'src/domain/entities/promo-code';
import { ValidationResult } from 'src/domain/validation.result';
import { ValidationRuleInterface } from 'src/contracts/validation-rule.interface';
import { OrderableInterface } from 'src/contracts/orderable.interface';
import { ErrorCode } from 'src/domain/error-code';
import type { PromoCodeUsageRepository } from 'src/domain/ports/promo-code-usage.repository';


/**
 * Regla configurable: número máximo de usos totales del código entre todos los usuarios.
 */
@Injectable()
export class GlobalUsageLimitRule implements ValidationRuleInterface {
  constructor(
    private readonly params: { limit: number },
    private readonly usageRepository: PromoCodeUsageRepository,
  ) { }

  validate(code: PromoCode | null, _order: OrderableInterface): ValidationResult {
    if (!code) return ValidationResult.fail(ErrorCode.INVALID_CODE);

    const usages = this.usageRepository.countPaidUsagesGlobal(code.id);

    if (usages >= this.params.limit) {
      return ValidationResult.fail(ErrorCode.USAGE_LIMIT_REACHED);
    }
    return ValidationResult.ok();
  }
}