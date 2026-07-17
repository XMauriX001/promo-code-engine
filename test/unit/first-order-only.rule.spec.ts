import { FirstOrderOnlyRule } from 'src/rules/configurable/first-order-only.rule';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode } from 'test/factories/promo-code.factory';
import { makeOrderable } from 'test/factories/orderable.factory';
import { makeBuyerProfile } from 'test/factories/buyer-profile.factory';
import { makeOrders } from 'test/factories/order.factory';

describe('FirstOrderOnlyRule', () => {
  const rule = new FirstOrderOnlyRule();

  it('bloquea cuando el comprador ya tiene órdenes pagadas', () => {
    const buyerProfile = makeBuyerProfile({ orderHistory: makeOrders(1, { status: 'paid' }) });
    const result = rule.validate(makePromoCode(), makeOrderable({ buyerProfile }));
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.CODE_ALREADY_USED);
  });

  it('permite cuando el comprador no tiene órdenes pagadas previas', () => {
    const buyerProfile = makeBuyerProfile({ orderHistory: [] });
    const result = rule.validate(makePromoCode(), makeOrderable({ buyerProfile }));
    expect(result.isValid).toBe(true);
  });
});