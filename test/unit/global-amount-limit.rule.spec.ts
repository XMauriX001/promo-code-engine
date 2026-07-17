import { GlobalAmountLimitRule } from 'src/rules/configurable/global-amount-limit.rule';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode } from 'test/factories/promo-code.factory';
import { makeOrderable } from 'test/factories/orderable.factory';

describe('GlobalAmountLimitRule', () => {
  it('bloquea cuando el monto acumulado pagado alcanzó el límite', () => {
    const usageRepository = { sumPaidDiscountAmount: jest.fn().mockReturnValue(5000) } as any;
    const rule = new GlobalAmountLimitRule({ amount: 5000 }, usageRepository);

    const result = rule.validate(makePromoCode(), makeOrderable());

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.MAXIMUM_DISCOUNT_REACHED);
  });

  it('permite cuando el monto acumulado está por debajo del límite', () => {
    const usageRepository = { sumPaidDiscountAmount: jest.fn().mockReturnValue(4999) } as any;
    const rule = new GlobalAmountLimitRule({ amount: 5000 }, usageRepository);

    const result = rule.validate(makePromoCode(), makeOrderable());

    expect(result.isValid).toBe(true);
  });
});