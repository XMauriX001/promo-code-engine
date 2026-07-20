import { HistoricalOrder } from "../historical.order";

export interface BuyerProfile {
  userId: string;
  orderHistory: HistoricalOrder[];
}