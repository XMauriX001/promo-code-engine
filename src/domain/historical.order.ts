export type OrderStatus = 'paid' | 'pending' | 'cancelled' | 'draft';

/**
 * Entidad que representa una orden histórica completada.
 */
export interface HistoricalOrder {
    id: string;
    status: OrderStatus;
    categoryId: string;
}