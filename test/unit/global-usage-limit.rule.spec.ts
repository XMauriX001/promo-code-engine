import { GlobalUsageLimitRule } from 'src/rules/configurable/global-usage-limit.rule';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode } from 'test/factories/promo-code.factory';
import { makeOrderable } from 'test/factories/orderable.factory';

describe('GlobalUsageLimitRule', () => {
  it('bloquea cuando se alcanzó el límite global de usos pagados', () => {
    const usageRepository = { countPaidUsagesGlobal: jest.fn().mockReturnValue(100) } as any;
    const rule = new GlobalUsageLimitRule({ limit: 100 }, usageRepository);

    const result = rule.validate(makePromoCode(), makeOrderable());

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.USAGE_LIMIT_REACHED);
  });

  it('permite cuando el conteo global está por debajo del límite', () => {
    const usageRepository = { countPaidUsagesGlobal: jest.fn().mockReturnValue(99) } as any;
    const rule = new GlobalUsageLimitRule({ limit: 100 }, usageRepository);

    const result = rule.validate(makePromoCode(), makeOrderable());

    expect(result.isValid).toBe(true);
  });
});