import { EligibleCategoriesRule } from 'src/rules/configurable/eligible-categories.rule';
import { ErrorCode } from 'src/domain/error-code';
import { makePromoCode } from 'test/factories/promo-code.factory';
import { makeOrderable } from 'test/factories/orderable.factory';

describe('EligibleCategoriesRule', () => {
  it('bloquea cuando la categoría no está dentro de las elegibles', () => {
    const hierarchy = { isWithin: jest.fn().mockReturnValue(false) };
    const rule = new EligibleCategoriesRule({ categoryIds: ['cat-a'] }, hierarchy);

    const result = rule.validate(makePromoCode(), makeOrderable({ categoryId: 'cat-z' }));

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe(ErrorCode.INVALID_CODE);
    expect(hierarchy.isWithin).toHaveBeenCalledWith('cat-z', ['cat-a']);
  });

  it('permite cuando la categoría está dentro de las elegibles (o es descendiente)', () => {
    const hierarchy = { isWithin: jest.fn().mockReturnValue(true) };
    const rule = new EligibleCategoriesRule({ categoryIds: ['cat-a'] }, hierarchy);

    const result = rule.validate(makePromoCode(), makeOrderable({ categoryId: 'cat-a-child' }));

    expect(result.isValid).toBe(true);
  });
});