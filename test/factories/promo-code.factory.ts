import {
  PromoCode,
  PromoCodeProps,
  ConfiguredRule,
} from 'src/domain/entities/promo-code';

let codeCounter = 0;

export function makePromoCode(overrides: Partial<PromoCodeProps> = {}): PromoCode {
  codeCounter += 1;
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  const defaults: PromoCodeProps = {
    id: `promo-${codeCounter}`,
    code: `CODE${codeCounter}`,
    type: 'percent',
    value: 10,
    status: 'active',
    startDate: new Date(now.getTime() - oneDay),
    endDate: new Date(now.getTime() + oneDay),
    rules: [] as ConfiguredRule[],
  };

  return new PromoCode({ ...defaults, ...overrides });
}

export function withRule(key: string, params: Record<string, unknown> = {}): ConfiguredRule {
  return { key, params };
}