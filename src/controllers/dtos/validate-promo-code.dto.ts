import { OrderStatus } from "src/domain/historical.order";

export class HistoricalOrderDto {
  id: string;
  status: OrderStatus;
  categoryId: string;
}

export class ValidatePromoCodeDto {
  code: string;
  subtotal: number;
  userId: string;
  categoryId: string;
  orderHistory?: HistoricalOrderDto[];
  currentOrders?: HistoricalOrderDto[];
}