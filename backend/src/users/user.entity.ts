import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Account } from '../accounts/account.entity';


export type Role = 'USER' | 'ADMIN';


@Entity()
export class User {
@PrimaryGeneratedColumn('uuid') id: string;


@Column({ unique: true }) email: string;


@Column() passwordHash: string;


@Column() fullName: string;


@Column({ type: 'varchar', default: 'USER' }) role: Role;


@OneToMany(() => Account, (a) => a.owner) accounts: Account[];
}