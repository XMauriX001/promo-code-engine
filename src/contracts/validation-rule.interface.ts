import { PromoCode } from '../domain/entities/promo-code';
import { ValidationResult } from '../domain/validation.result';
import { OrderableInterface } from './orderable.interface';

/**
 * Contrato que implementa cada regla de validación, fija o configurable.
 * Recibe la orden completa, no solo el contexto
 */
export interface ValidationRuleInterface {
  validate(code: PromoCode | null, order: OrderableInterface): ValidationResult;
}