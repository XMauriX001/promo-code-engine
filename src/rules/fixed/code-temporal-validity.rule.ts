import { Injectable } from '@nestjs/common';
import { PromoCode } from '../../domain/entities/promo-code';
import { ValidationResult } from '../../domain/validation.result';
import { ValidationRuleInterface } from '../../contracts/validation-rule.interface';
import { OrderableInterface } from '../../contracts/orderable.interface';
import { ErrorCode } from '../../domain/error-code';

@Injectable()
export class CodeTemporalValidityRule implements ValidationRuleInterface {
  private readonly now: () => Date;

  constructor(now: () => Date = () => new Date()) {
    this.now = now;
  }

  validate(code: PromoCode | null, _order: OrderableInterface): ValidationResult {
    if (!code) return ValidationResult.fail(ErrorCode.INVALID_CODE);

    const currentDate = this.now();
    if (currentDate < code.startDate || currentDate > code.endDate) {
      return ValidationResult.fail(ErrorCode.EXPIRED_COUPON);
    }
    return ValidationResult.ok();
  }
}