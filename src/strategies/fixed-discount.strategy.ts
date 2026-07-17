import { Injectable } from '@nestjs/common';
import { PromoCode } from '../domain/entities/promo-code';
import { OrderContext } from 'src/domain/entities/order.context';
import { DiscountStrategyInterface } from '../contracts/discount-strategy.interface';

/**Estrategia de descuento fijo */
@Injectable()
export class FixedDiscountStrategy implements DiscountStrategyInterface {
  calculate(code: PromoCode, subtotal: number, _context: OrderContext): number {
    return Math.min(code.value, subtotal);
  }
}