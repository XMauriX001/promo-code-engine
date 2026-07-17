import { PromoCode } from '../domain/entities/promo-code';
import { OrderContext } from 'src/domain/entities/order.context';

export interface DiscountStrategyInterface {
  calculate(code: PromoCode, subtotal: number, context: OrderContext): number;
}