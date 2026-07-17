import { Injectable } from '@nestjs/common';
import { PromoCode, DiscountType } from 'src/domain/entities/promo-code';
import { DiscountStrategyInterface } from 'src/contracts/discount-strategy.interface';
import { MaxDiscountDecorator } from './max-discount.decorator';
import { FixedDiscountStrategy } from './fixed-discount.strategy';
import { PercentDiscountStrategy } from './percent-discount.strategy';
import { TieredDiscountStrategy } from './tiered-discount.strategy';

type StrategyBuilder = () => DiscountStrategyInterface;

/** Factory que crea la estrategia según code.type y aplica el decorator si corresponde. */
@Injectable()
export class DiscountStrategyFactory {
  private readonly registry = new Map<DiscountType, StrategyBuilder>();

  constructor(
    private readonly fixed: FixedDiscountStrategy,
    private readonly percent: PercentDiscountStrategy,
    private readonly tiered: TieredDiscountStrategy,
  ) {
    this.register('fixed', () => this.fixed);
    this.register('percent', () => this.percent);
    this.register('tiered', () => this.tiered);
  }

  register(type: DiscountType, builder: StrategyBuilder): void {
    this.registry.set(type, builder);
  }

  create(code: PromoCode): DiscountStrategyInterface {
    const builder = this.registry.get(code.type);
    if (!builder) throw new Error(`No hay estrategia registrada para el tipo: ${code.type}`);

    const strategy = builder();
    return code.maxDiscountAmount !== undefined ? new MaxDiscountDecorator(strategy) : strategy;
  }
}