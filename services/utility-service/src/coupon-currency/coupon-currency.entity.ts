import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Coupon } from '../coupons/coupons.entity';
import { Currency } from '../currency/currency.entity';

@Entity('wit_coupon_currency')
export class CouponCurrency {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'int',
    })
    currencyId: number;

    @Column({
        type: 'int'
    })
    couponId: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    value: number;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: true
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        nullable: true
    })
    updatedAt: Date;

    // Relationships
    @ManyToOne(() => Currency)
    @JoinColumn({ name: 'currencyId' })
    currency: Currency;

    @ManyToOne(() => Coupon)
    @JoinColumn({ name: 'couponId' })
    coupon: Coupon;
} 