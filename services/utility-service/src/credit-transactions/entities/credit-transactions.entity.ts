import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
export enum CreditModule {
    WOCADEMY = 'WOCADEMY',
    MENTORSHIP = 'MENTORSHIP'
}
@Entity('wit_wocademy_credit_transactions')
export class CreditTransaction {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'varchar',
        comment: 'User ID who transferred the credits',
        length: 50,
        nullable: true
    })
    transferredById: string;

    @Column({
        type: 'varchar',
        comment: 'User ID who received the credits',
        length: 50,
        nullable: true
    })
    transferredToId: string;

    @Column({
        type: 'varchar',
        comment: 'User ID who performed the action',
        length: 50,
        nullable: true
    })
    actionBy: string;

    @Column({
        type: 'enum',
        enum: CreditModule,
        default: CreditModule.WOCADEMY
    })
    module: CreditModule;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: 'Amount transferred',
        default: 0.00
    })
    amount: number;

    @Column({
        type: 'bigint',
        comment: 'Balance of user who transferred credits after transaction',
        default: 0
    })
    balanceTransferredBy: number;

    @Column({
        type: 'bigint',
        comment: 'Balance of user who received credits after transaction',
        default: 0
    })
    balanceTransferredTo: number;

    @Column({
        type: 'text',
        comment: 'Additional remarks for the transaction',
        nullable: true
    })
    remarks: string;

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