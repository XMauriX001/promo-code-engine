import { PromoCode } from 'src/domain/entities/promo-code';
import { OrderContext } from 'src/domain/entities/order.context';
import { DiscountStrategyInterface } from 'src/contracts/discount-strategy.interface';

/**
 * Decorator: aplica max_discount_amount envolviendo cualquier estrategia sin modificarla.
 */

export class MaxDiscountDecorator implements DiscountStrategyInterface {
  constructor(private readonly strategy: DiscountStrategyInterface) {}

  calculate(code: PromoCode, subtotal: number, context: OrderContext): number {
    const baseDiscount = this.strategy.calculate(code, subtotal, context);
    if (code.maxDiscountAmount === undefined) return baseDiscount;
    return Math.min(baseDiscount, code.maxDiscountAmount);
  }
}