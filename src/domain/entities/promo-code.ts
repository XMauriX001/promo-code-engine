import { DiscountTier } from './discount-tier';

export type DiscountType = 'fixed' | 'percent' | 'tiered';
export type PromoCodeStatus = 'draft' | 'active' | 'paused' | 'expired';

/**
 * Reglas configuradas con sus parámetros
 */
export interface ConfiguredRule {
  key: string;
  params: Record<string, unknown>;
}

/**
 * Propiedades del promo code
 */
export interface PromoCodeProps {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  status: PromoCodeStatus;
  startDate: Date;
  endDate: Date;
  rules: ConfiguredRule[];
  tiers?: DiscountTier[];
  restrictedUserIds?: string[];
  maxDiscountAmount?: number;
}

/**
 * Entidad PromoCode que persiste tipo, valor base, estado, fechas de vigencia
 * y el conjunto de reglas activas con sus parámetros
 */
export class PromoCode {
  readonly id: string;
  readonly code: string;
  readonly type: DiscountType;
  readonly value: number;
  readonly status: PromoCodeStatus;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly rules: ConfiguredRule[];
  readonly tiers: DiscountTier[];
  readonly restrictedUserIds: string[];
  readonly maxDiscountAmount?: number;

  constructor(props: PromoCodeProps) {
    this.id = props.id;
    this.code = props.code;
    this.type = props.type;
    this.value = props.value;
    this.status = props.status;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.rules = props.rules;
    this.tiers = props.tiers ?? [];
    this.restrictedUserIds = props.restrictedUserIds ?? [];
    this.maxDiscountAmount = props.maxDiscountAmount;
  }

  hasRule(key: string): boolean {
    return this.rules.some((r) => r.key === key);
  }

  getRuleParams(key: string): Record<string, unknown> | undefined {
    return this.rules.find((r) => r.key === key)?.params;
  }
}