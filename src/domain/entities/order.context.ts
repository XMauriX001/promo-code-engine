import { BuyerProfile } from './buyer.profile';
import { HistoricalOrder } from '../historical.order';


export class OrderContext {
  constructor(
    public readonly buyerProfile: BuyerProfile,
    public readonly categoryId: string,
    public readonly currentOrders: HistoricalOrder[],
  ) {}
}