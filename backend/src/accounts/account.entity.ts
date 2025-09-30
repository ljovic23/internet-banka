import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';


@Entity()
export class Account {
@PrimaryGeneratedColumn('uuid') id: string;


@Column({ unique: true }) iban: string;


@Column({ type: 'numeric', precision: 14, scale: 2, default: 0 }) balance: string;


@ManyToOne(() => User, (u) => u.accounts, { eager: true }) owner: User;


@OneToMany(() => Transaction, (t) => t.account) transactions: Transaction[];
}