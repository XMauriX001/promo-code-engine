import { OrderableInterface } from 'src/contracts/orderable.interface';
import { OrderContext } from 'src/domain/entities/order.context';
import { ValidatePromoCodeDto } from './dtos/validate-promo-code.dto';

/**
 * Adapta el body de la request HTTP a OrderableInterface
 */
export class OrderRequestAdapter implements OrderableInterface {
  constructor(private readonly dto: ValidatePromoCodeDto) {}

  getSubtotal(): number {
    return this.dto.subtotal;
  }

  getOrderContext(): OrderContext {
    return new OrderContext(
      { userId: this.dto.userId, orderHistory: this.dto.orderHistory ?? [] },
      this.dto.categoryId,
      this.dto.currentOrders ?? [],
    );
  }
}