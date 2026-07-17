import { OrderContext } from '../order.context';

/**
 * Contrato de integración
 */

export interface OrderableInterface {
  getSubtotal(): number;
  getOrderContext(): OrderContext;
}