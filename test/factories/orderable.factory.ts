import { OrderableInterface } from 'src/contracts/orderable.interface';
import { OrderContext } from 'src/domain/entities/order.context';
import { BuyerProfile } from 'src/domain/entities/buyer.profile';
import { HistoricalOrder } from 'src/domain/historical.order';
import { makeBuyerProfile } from './buyer-profile.factory';

interface OrderableOverrides {
  subtotal?: number;
  buyerProfile?: BuyerProfile;
  categoryId?: string;
  currentOrders?: HistoricalOrder[];
}


export function makeOrderable(overrides: OrderableOverrides = {}): OrderableInterface {
  const subtotal = overrides.subtotal ?? 100;
  const buyerProfile = overrides.buyerProfile ?? makeBuyerProfile();
  const categoryId = overrides.categoryId ?? 'cat-default';
  const currentOrders = overrides.currentOrders ?? [];

  return {
    getSubtotal: () => subtotal,
    getOrderContext: () => new OrderContext(buyerProfile, categoryId, currentOrders),
  };
}