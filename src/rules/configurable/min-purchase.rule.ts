import { Injectable } from '@nestjs/common';
import { PromoCode } from '../../domain/entities/promo-code';
import { ValidationResult } from '../../domain/validation.result';
import { ValidationRuleInterface } from 'src/contracts/validation-rule.interface';
import { OrderableInterface } from 'src/contracts/orderable.interface';
import { ErrorCode } from 'src/domain/error-code';

/**
 * Regla configurable: cantidad mínima de compra.
 */
@Injectable()
export class MinPurchaseRule implements ValidationRuleInterface {
  constructor(private readonly params: { amount: number }) {}

  validate(_code: PromoCode | null, order: OrderableInterface): ValidationResult {
    if (order.getSubtotal() < this.params.amount) {
      return ValidationResult.fail(ErrorCode.MIN_AMOUNT_REQUIRED);
    }
    return ValidationResult.ok();
  }
}