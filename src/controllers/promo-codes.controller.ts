import { Body, Controller, HttpCode, Post, Inject } from '@nestjs/common';
import { PromoCodeEngine } from '../engine/promo-code-engine.service';
import { ValidatePromoCodeDto } from './dtos/validate-promo-code.dto';
import { OrderRequestAdapter } from './order-request.adapter';
import { PROMO_CODE_REPOSITORY } from 'src/contracts/promo-code.repository';
import type { PromoCodeRepository } from 'src/contracts/promo-code.repository';
import { PROMO_CODE_USAGE_REPOSITORY } from 'src/domain/ports/promo-code-usage.repository';
import type { PromoCodeUsageRepository } from 'src/domain/ports/promo-code-usage.repository';

@Controller('promo-codes')
export class PromoCodesController {
  constructor(
    private readonly engine: PromoCodeEngine,
    @Inject(PROMO_CODE_REPOSITORY) private readonly promoCodeRepository: PromoCodeRepository,
    @Inject(PROMO_CODE_USAGE_REPOSITORY) private readonly usageRepository: PromoCodeUsageRepository,
  ) { }

  @Post('setup')
  @HttpCode(201)
  setupTestPromoCode(@Body() promoCodeData: any) {
    this.promoCodeRepository.save(promoCodeData);

    return {
      message: 'Código configurado en memoria con éxito.',
      code: promoCodeData.code
    };
  }

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

    this.usageRepository.recordPaidUsage(dto.code, dto.userId, discountAmount);

    return {
      valid: true,
      discountAmount,
    };
  }
}