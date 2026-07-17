import { MinPurchaseRule } from 'src/rules/configurable/min-purchase.rule';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode } from 'test/factories/promo-code.factory';
import { makeOrderable } from 'test/factories/orderable.factory';

describe('MinPurchaseRule', () => {
  it('bloquea cuando el subtotal es menor al mínimo', () => {
    const rule = new MinPurchaseRule({ amount: 50 });
    const result = rule.validate(makePromoCode(), makeOrderable({ subtotal: 30 }));
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.MIN_AMOUNT_REQUIRED);
  });

  it('permite cuando el subtotal alcanza o supera el mínimo', () => {
    const rule = new MinPurchaseRule({ amount: 50 });
    const result = rule.validate(makePromoCode(), makeOrderable({ subtotal: 50 }));
    expect(result.isValid).toBe(true);
  });
});