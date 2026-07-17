/**
 * Define los escalones de descuento: cantidad mínima de órdenes previas
 * y el porcentaje de descuento que aplica en ese escalón.
 */
export interface DiscountTier {
  minOrders: number;
  percent: number;
}