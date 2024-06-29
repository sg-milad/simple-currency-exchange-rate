import {
    Entity, PrimaryGeneratedColumn, Column,
    BaseEntity, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity({ name: "exchange_rate" })
export class ExchangeRateEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "currency_symbol", type: "varchar" })
    currencySymbol: string;

    @Column({ type: 'decimal' })
    rate: number; //  currency rate to USD

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}