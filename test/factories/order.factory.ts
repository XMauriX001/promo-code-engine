import { HistoricalOrder, OrderStatus } from "src/domain/historical.order";

let orderCounter = 0;

export function makeOrder(overrides: Partial<HistoricalOrder> = {}): HistoricalOrder {
  orderCounter += 1;
  return {
    id: `order-${orderCounter}`,
    status: 'paid' as OrderStatus,
    categoryId: 'cat-default',
    ...overrides,
  };
}

export function makeOrders(count: number, overrides: Partial<HistoricalOrder> = {}): HistoricalOrder[] {
  return Array.from({ length: count }, () => makeOrder(overrides));
}