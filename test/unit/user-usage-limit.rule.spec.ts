import { UserUsageLimitRule } from 'src/rules/configurable/user-usage-limit.rule';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode } from 'test/factories/promo-code.factory';
import { makeOrderable } from 'test/factories/orderable.factory';
import { makeBuyerProfile } from 'test/factories/buyer-profile.factory';

describe('UserUsageLimitRule', () => {
  it('bloquea cuando el usuario ya alcanzó el límite de usos pagados', () => {
    const usageRepository = { countPaidUsagesByUser: jest.fn().mockReturnValue(2) } as any;
    const rule = new UserUsageLimitRule({ limit: 2 }, usageRepository);
    const code = makePromoCode();
    const buyerProfile = makeBuyerProfile();

    const result = rule.validate(code, makeOrderable({ buyerProfile }));

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.USAGE_LIMIT_REACHED);
    expect(usageRepository.countPaidUsagesByUser).toHaveBeenCalledWith(code.id, buyerProfile.userId);
  });

  it('permite cuando el usuario está por debajo del límite', () => {
    const usageRepository = { countPaidUsagesByUser: jest.fn().mockReturnValue(1) } as any;
    const rule = new UserUsageLimitRule({ limit: 2 }, usageRepository);

    const result = rule.validate(makePromoCode(), makeOrderable());

    expect(result.isValid).toBe(true);
  });
});