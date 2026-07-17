import { Injectable } from '@nestjs/common';
import { PromoCode } from 'src/domain/entities/promo-code';
import { ValidationResult } from 'src/domain/validation.result';
import { ValidationRuleInterface } from 'src/contracts/validation-rule.interface';
import { OrderableInterface } from 'src/contracts/orderable.interface';
import { ErrorCode } from 'src/domain/error-code';

/**
 * Regla configurable: solo puede usarse en la primera orden del comprador.
 */
@Injectable()
export class FirstOrderOnlyRule implements ValidationRuleInterface {
  validate(_code: PromoCode | null, order: OrderableInterface): ValidationResult {
    const { buyerProfile } = order.getOrderContext();
    const hasPaidOrders = buyerProfile.orderHistory.some((o) => o.status === 'paid');
    if (hasPaidOrders) {
      return ValidationResult.fail(ErrorCode.CODE_ALREADY_USED);
    }
    return ValidationResult.ok();
  }
}