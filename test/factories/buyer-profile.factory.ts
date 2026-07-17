import { BuyerProfile } from 'src/domain/entities/buyer.profile';
import { HistoricalOrder } from 'src/domain/historical.order';

let buyerCounter = 0;

export function makeBuyerProfile(overrides: Partial<BuyerProfile> = {}): BuyerProfile {
  buyerCounter += 1;
  return {
    userId: `user-${buyerCounter}`,
    orderHistory: [] as HistoricalOrder[],
    ...overrides,
  };
}