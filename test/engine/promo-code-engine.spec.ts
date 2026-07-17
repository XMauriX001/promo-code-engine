import { PromoCodeEngine } from 'src/engine/promo-code-engine.service';
import { ValidationRuleFactory } from 'src/rules/validation-rule.factory';
import { CodeExistsRule } from 'src/rules/fixed/code-exists.rule';
import { CodeTemporalValidityRule } from 'src/rules/fixed/code-temporal-validity.rule';
import { CodeActiveStatusRule } from 'src/rules/fixed/code-active-status.rule';
import { InMemoryPromoCodeRepository } from 'src/infraestructure/in-memory-promo-code.repository';
import { InMemoryPromoCodeUsageRepository } from 'src/infraestructure/in-memory-promo-code-usage.repository';
import { InMemoryCategoryHierarchy } from 'src/infraestructure/in-memory-category-hierarchy';
import { DiscountStrategyFactory } from 'src/strategies/discount-strategy.factory';
import { FixedDiscountStrategy } from 'src/strategies/fixed-discount.strategy';
import { PercentDiscountStrategy } from 'src/strategies/percent-discount.strategy';
import { TieredDiscountStrategy } from 'src/strategies/tiered-discount.strategy';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode, withRule } from '../factories/promo-code.factory';
import { makeOrderable } from '../factories/orderable.factory';

function buildEngine(fixedNow = new Date('2026-07-16T12:00:00Z')) {
  const promoCodeRepository = new InMemoryPromoCodeRepository();
  const usageRepository = new InMemoryPromoCodeUsageRepository();
  const categoryHierarchy = new InMemoryCategoryHierarchy();

  const validationRuleFactory = new ValidationRuleFactory(categoryHierarchy, usageRepository);
  const discountStrategyFactory = new DiscountStrategyFactory(
    new FixedDiscountStrategy(),
    new PercentDiscountStrategy(),
    new TieredDiscountStrategy(),
  );

  const engine = new PromoCodeEngine(
    promoCodeRepository,
    validationRuleFactory,
    discountStrategyFactory,
    new CodeExistsRule(),
    new CodeTemporalValidityRule(() => fixedNow),
    new CodeActiveStatusRule(),
  );

  return { engine, promoCodeRepository };
}

describe('PromoCodeEngine', () => {
  it('rechaza un código inexistente con invalid_code', () => {
    const { engine } = buildEngine();
    const result = engine.validate('NOEXISTE', makeOrderable());
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.INVALID_CODE);
  });

  it('corta en la primera regla fija que falla, sin evaluar reglas configurables', () => {
    const { engine, promoCodeRepository } = buildEngine();
    const code = makePromoCode({
      status: 'paused',
      rules: [withRule('min_purchase_amount', { amount: 999999 })],
    });
    promoCodeRepository.seed(code);

    const result = engine.validate(code.code, makeOrderable({ subtotal: 10 }));

    expect(result.errorCode).toBe(ErrorCode.INVALID_CODE);
  });

  it('valida correctamente un código sin reglas configurables', () => {
    const { engine, promoCodeRepository } = buildEngine();
    const code = makePromoCode();
    promoCodeRepository.seed(code);

    const result = engine.validate(code.code, makeOrderable());

    expect(result.isValid).toBe(true);
  });

  it('evalúa las reglas configurables activas y bloquea si alguna falla', () => {
    const { engine, promoCodeRepository } = buildEngine();
    const code = makePromoCode({
      rules: [withRule('min_purchase_amount', { amount: 100 })],
    });
    promoCodeRepository.seed(code);

    const result = engine.validate(code.code, makeOrderable({ subtotal: 50 }));

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.MIN_AMOUNT_REQUIRED);
  });

  it('calcula el descuento percent correctamente para un código válido', () => {
    const { engine, promoCodeRepository } = buildEngine();
    const code = makePromoCode({ type: 'percent', value: 15 });
    promoCodeRepository.seed(code);

    const discount = engine.calculateDiscount(code.code, makeOrderable({ subtotal: 200 }));

    expect(discount).toBe(30);
  });

  it('aplica max_discount_amount como tope sobre el cálculo base', () => {
    const { engine, promoCodeRepository } = buildEngine();
    const code = makePromoCode({ type: 'percent', value: 50, maxDiscountAmount: 20 });
    promoCodeRepository.seed(code);

    const discount = engine.calculateDiscount(code.code, makeOrderable({ subtotal: 200 }));

    expect(discount).toBe(20);
  });
});