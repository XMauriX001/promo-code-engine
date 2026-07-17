import { Injectable } from '@nestjs/common';
import { PromoCode } from 'src/domain/entities/promo-code';
import { ValidationResult } from 'src/domain/validation.result';
import { ValidationRuleInterface } from 'src/contracts/validation-rule.interface';
import { OrderableInterface } from 'src/contracts/orderable.interface';
import { ErrorCode } from 'src/domain/error-code';

/**
 * Regla configurable: el código está asignado explícitamente a un subconjunto de usuarios.
*/

@Injectable()
export class RestrictedUsageRule implements ValidationRuleInterface {
  validate(code: PromoCode | null, order: OrderableInterface): ValidationResult {
    if (!code) return ValidationResult.fail(ErrorCode.INVALID_CODE);

    const { buyerProfile } = order.getOrderContext();
    if (!code.restrictedUserIds.includes(buyerProfile.userId)) {
      return ValidationResult.fail(ErrorCode.RESTRICTED_USAGE);
    }
    return ValidationResult.ok();
  }
}