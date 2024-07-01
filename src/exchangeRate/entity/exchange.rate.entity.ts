import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "exchange_rate" })
export class ExchangeRateEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", name: "from_currency" })
    fromCurrency: string

    @Column({ type: "varchar", name: "to_currency" })
    toCurrency: string

    @Column({ type: "decimal" })
    rate: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
