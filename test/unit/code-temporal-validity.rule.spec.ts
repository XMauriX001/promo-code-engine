import { CodeTemporalValidityRule } from 'src/rules/fixed/code-temporal-validity.rule';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode } from 'test/factories/promo-code.factory';
import { makeOrderable } from 'test/factories/orderable.factory';

describe('CodeTemporalValidityRule', () => {
  const fixedNow = new Date('2026-07-16T12:00:00Z');
  const rule = new CodeTemporalValidityRule(() => fixedNow);

  it('bloquea cuando el código aún no inicia su vigencia', () => {
    const code = makePromoCode({
      startDate: new Date('2026-08-01T00:00:00Z'),
      endDate: new Date('2026-09-01T00:00:00Z'),
    });
    const result = rule.validate(code, makeOrderable());
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.EXPIRED_COUPON);
  });

  it('bloquea cuando el código ya expiró', () => {
    const code = makePromoCode({
      startDate: new Date('2026-01-01T00:00:00Z'),
      endDate: new Date('2026-06-01T00:00:00Z'),
    });
    const result = rule.validate(code, makeOrderable());
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.EXPIRED_COUPON);
  });

  it('permite cuando la fecha actual está dentro del rango de vigencia', () => {
    const code = makePromoCode({
      startDate: new Date('2026-07-01T00:00:00Z'),
      endDate: new Date('2026-08-01T00:00:00Z'),
    });
    const result = rule.validate(code, makeOrderable());
    expect(result.isValid).toBe(true);
  });
});