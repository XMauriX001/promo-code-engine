import { CodeActiveStatusRule } from 'src/rules/fixed/code-active-status.rule';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode } from 'test/factories/promo-code.factory';
import { makeOrderable } from 'test/factories/orderable.factory';

describe('CodeActiveStatusRule', () => {
  const rule = new CodeActiveStatusRule();

  it.each(['draft', 'paused', 'expired'] as const)('bloquea cuando el estado es %s', (status) => {
    const code = makePromoCode({ status });
    const result = rule.validate(code, makeOrderable());
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.INVALID_CODE);
  });

  it('permite cuando el estado es active', () => {
    const code = makePromoCode({ status: 'active' });
    const result = rule.validate(code, makeOrderable());
    expect(result.isValid).toBe(true);
  });
});