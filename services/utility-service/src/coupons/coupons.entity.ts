import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum CouponType {
    INDIVIDUAL = 1,
    CORPORATE = 2,
    ALL = 3
}

export enum DiscountType {
    PERCENT = 'Percent',
    FLAT = 'Flat'
}

export enum CouponStatus {
    INACTIVE = 0,
    ACTIVE = 1
}

@Entity('wit_coupons')
export class Coupon {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'varchar',
        length: 20,
        charset: 'utf8mb4',
        collation: 'utf8mb4_0900_ai_ci'
    })
    label: string;

    @Column({
        type: 'varchar',
        length: 8,
        charset: 'utf8mb4',
        collation: 'utf8mb4_0900_ai_ci'
    })
    code: string;

    @Column({
        type: 'tinyint',
        default: CouponStatus.ACTIVE
    })
    status: number;

    @Column({
        type: 'tinyint',
        comment: 'Individual,Corporate,All'
    })
    couponType: number;

    @Column({
        type: 'varchar',
        length: 15,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
        comment: 'Percent,Flat'
    })
    discountType: string;

    @Column({
        type: 'smallint',
        nullable: true
    })
    maximumNumber: number;

    @Column({
        type: 'date',
        nullable: true
    })
    expiryDate: Date;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
        nullable: true
    })
    companyDomain: string;

    @Column({
        type: 'bigint',
        unsigned: true
    })
    createdBy: number;

    @CreateDateColumn({
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
} 