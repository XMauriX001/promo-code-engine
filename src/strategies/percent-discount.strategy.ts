import { Injectable } from '@nestjs/common';
import { PromoCode } from '../domain/entities/promo-code';
import { OrderContext } from 'src/domain/entities/order.context';
import { DiscountStrategyInterface } from 'src/contracts/discount-strategy.interface';

/**
 * Representa la estrategia de descuento porcentual
 */

@Injectable()
export class PercentDiscountStrategy implements DiscountStrategyInterface {
  calculate(code: PromoCode, subtotal: number, _context: OrderContext): number {
    return subtotal * (code.value / 100);
  }
}