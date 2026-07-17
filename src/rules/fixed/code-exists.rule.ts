import { Injectable } from '@nestjs/common';
import { PromoCode } from '../../domain/entities/promo-code';
import { ValidationResult } from '../../domain/validation.result';
import { ValidationRuleInterface } from '../../contracts/validation-rule.interface';
import { OrderableInterface } from 'src/contracts/orderable.interface';
import { ErrorCode } from '../../domain/error-code';

@Injectable()
export class CodeExistsRule implements ValidationRuleInterface {
  validate(code: PromoCode | null, _order: OrderableInterface): ValidationResult {
    if (code === null) {
      return ValidationResult.fail(ErrorCode.INVALID_CODE);
    }
    return ValidationResult.ok();
  }
}