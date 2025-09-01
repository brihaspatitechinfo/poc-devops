import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum MoneyType {
    CREDIT = 'credit',
    FREE = 'free',
    REAL = 'real'
}
export enum OrderStatus {
    PENDING = 0,
    SUCCESS = 1,
    FAILED = 2,
    REFUNDED = 3
}

@Entity('wit_orders')
export class WitOrder {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
        comment: 'Unique order number'
    })
    orderNum: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        unique: true,
        comment: 'External order ID'
    })
    orderId: string;

    @Column({
        type: 'varchar',
        length: 50,
        comment: 'User ID who placed the order'
    })
    userId: string;

    @Column({
        type: 'bigint',
        unsigned: true,
        comment: 'Currency ID for the order'
    })
    currencyId: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: 'Order amount'
    })
    amount: number;

    @Column({
        type: 'enum',
        enum: MoneyType,
        comment: 'Type of money used for payment'
    })
    moneyType: MoneyType;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: 'Credit balance after transaction'
    })
    balanceCredit: number;

    @Column({
        type: 'varchar',
        length: 255,
        comment: 'Module type: wocademy, events, mentorship'
    })
    moduleType: string;

    @Column({
        type: 'tinyint',
        unsigned: true,
        comment: 'Module ID reference'
    })
    moduleId: number;

    @Column({
        type: 'tinyint',
        unsigned: true,
        default: 0,
        comment: '0=>PENDING;1=>SUCCESS;2=>FAILED;3=>REFUNDED'
    })
    status: OrderStatus;

    @Column({
        type: 'json',
        nullable: true,
        comment: 'Additional order metadata'
    })
    orderMeta: any;

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