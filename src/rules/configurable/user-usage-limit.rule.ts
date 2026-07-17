import { Injectable } from '@nestjs/common';
import { PromoCode } from 'src/domain/entities/promo-code';
import { ValidationResult } from 'src/domain/validation.result';
import { ValidationRuleInterface } from 'src/contracts/validation-rule.interface';
import { OrderableInterface } from 'src/contracts/orderable.interface';
import { ErrorCode } from 'src/domain/error-code';
import type { PromoCodeUsageRepository } from 'src/domain/ports/promo-code-usage.repository';


/** Regla configurable: número máximo de veces que un mismo usuario puede usar el código. */
@Injectable()
export class UserUsageLimitRule implements ValidationRuleInterface {
  constructor(
    private readonly params: { limit: number },
    private readonly usageRepository: PromoCodeUsageRepository,
  ) {}

  validate(code: PromoCode | null, order: OrderableInterface): ValidationResult {
    if (!code) return ValidationResult.fail(ErrorCode.INVALID_CODE);

    const { buyerProfile } = order.getOrderContext();
    const usages = this.usageRepository.countPaidUsagesByUser(code.id, buyerProfile.userId);
    if (usages >= this.params.limit) {
      return ValidationResult.fail(ErrorCode.USAGE_LIMIT_REACHED);
    }
    return ValidationResult.ok();
  }
}