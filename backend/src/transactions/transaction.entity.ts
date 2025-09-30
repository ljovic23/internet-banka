import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Account } from '../accounts/account.entity';


type TxType = 'INTERNAL_TRANSFER' | 'EXTERNAL_PAYMENT' | 'CARD' | 'FEE';


@Entity()
export class Transaction {
@PrimaryGeneratedColumn('uuid') id: string;


@ManyToOne(() => Account, (a) => a.transactions, { eager: true }) account: Account;


@Column({ type: 'numeric', precision: 14, scale: 2 }) amount: string; // pozitivno = priljev, negativno = odljev


@Column({ type: 'varchar' }) type: TxType;


@Column({ nullable: true }) counterpartyIban: string;


@Column({ nullable: true }) description: string;


@CreateDateColumn() createdAt: Date;
}