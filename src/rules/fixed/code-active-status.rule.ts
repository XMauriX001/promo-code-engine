import { Injectable } from '@nestjs/common';
import { PromoCode } from '../../domain/entities/promo-code';
import { ValidationResult } from '../../domain/validation.result';
import { ValidationRuleInterface } from '../../contracts/validation-rule.interface';
import { OrderableInterface } from '../../contracts/orderable.interface';
import { ErrorCode } from '../../domain/error-code';

@Injectable()
export class CodeActiveStatusRule implements ValidationRuleInterface {
  validate(code: PromoCode | null, _order: OrderableInterface): ValidationResult {
    if (!code) return ValidationResult.fail(ErrorCode.INVALID_CODE);

    if (code.status !== 'active') {
      return ValidationResult.fail(ErrorCode.INVALID_CODE);
    }
    return ValidationResult.ok();
  }
}