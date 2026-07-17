import { RestrictedUsageRule } from 'src/rules/configurable/restricted-usage.rule';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode } from 'test/factories/promo-code.factory';
import { makeOrderable } from 'test/factories/orderable.factory';
import { makeBuyerProfile } from 'test/factories/buyer-profile.factory';

describe('RestrictedUsageRule', () => {
  const rule = new RestrictedUsageRule();

  it('bloquea cuando el usuario no está en la lista de autorizados', () => {
    const code = makePromoCode({ restrictedUserIds: ['user-authorized'] });
    const buyerProfile = makeBuyerProfile({ userId: 'user-not-authorized' });

    const result = rule.validate(code, makeOrderable({ buyerProfile }));

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.RESTRICTED_USAGE);
  });

  it('permite cuando el usuario está en la lista de autorizados', () => {
    const buyerProfile = makeBuyerProfile({ userId: 'user-authorized' });
    const code = makePromoCode({ restrictedUserIds: [buyerProfile.userId] });

    const result = rule.validate(code, makeOrderable({ buyerProfile }));

    expect(result.isValid).toBe(true);
  });
});