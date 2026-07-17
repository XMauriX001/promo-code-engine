import { CodeExistsRule } from 'src/rules/fixed/code-exists.rule';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode } from 'test/factories/promo-code.factory';
import { makeOrderable } from 'test/factories/orderable.factory';

describe('CodeExistsRule', () => {
  const rule = new CodeExistsRule();

  it('bloquea cuando el código no existe (null)', () => {
    const result = rule.validate(null, makeOrderable());
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.INVALID_CODE);
  });

  it('permite cuando el código existe', () => {
    const result = rule.validate(makePromoCode(), makeOrderable());
    expect(result.isValid).toBe(true);
  });
});