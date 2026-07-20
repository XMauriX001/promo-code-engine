import { OrderContext } from "src/domain/entities/order.context";

/**
 * Contrato de integración
 */

export interface OrderableInterface {
  getSubtotal(): number;
  getOrderContext(): OrderContext;
}