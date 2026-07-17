import { Injectable } from '@nestjs/common';
import { PromoCode } from 'src/domain/entities/promo-code';
import { OrderContext } from 'src/domain/entities/order.context';
import { DiscountStrategyInterface } from 'src/contracts/discount-strategy.interface';
import { DiscountTier } from 'src/domain/entities/discount-tier';

/**
 * Estrategia escalonada
 */

@Injectable()
export class TieredDiscountStrategy implements DiscountStrategyInterface {
  calculate(code: PromoCode, subtotal: number, context: OrderContext): number {
    const previousOrdersCount = this.countEligiblePreviousOrders(context);
    const tier = this.selectHighestEligibleTier(code.tiers, previousOrdersCount);
    return subtotal * (tier.percent / 100);
  }

  private countEligiblePreviousOrders(context: OrderContext): number {
    return context.buyerProfile.orderHistory.filter(
      (o) => o.status !== 'cancelled' && o.status !== 'draft',
    ).length;
  }

  private selectHighestEligibleTier(tiers: DiscountTier[], previousOrdersCount: number): DiscountTier {
    const eligible = tiers
      .filter((t) => previousOrdersCount >= t.minOrders)
      .sort((a, b) => b.minOrders - a.minOrders);
    return eligible[0];
  }
}