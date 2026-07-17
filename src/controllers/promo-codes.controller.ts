import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PromoCodeEngine } from '../engine/promo-code-engine.service';
import { ValidatePromoCodeDto } from './dtos/validate-promo-code.dto';
import { OrderRequestAdapter } from './order-request.adapter';

@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly engine: PromoCodeEngine) {}

  @Post('validate')
  @HttpCode(200)
  validate(@Body() dto: ValidatePromoCodeDto) {
    const order = new OrderRequestAdapter(dto);
    const validationResult = this.engine.validate(dto.code, order);

    if (!validationResult.isValid) {
      return {
        valid: false,
        errorCode: validationResult.errorCode,
      };
    }

    const discountAmount = this.engine.calculateDiscount(dto.code, order);

    return {
      valid: true,
      discountAmount,
    };
  }
}