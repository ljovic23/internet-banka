import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';
export declare class AccountsService {
    private accounts;
    private tx;
    private users;
    constructor(accounts: Repository<Account>, tx: Repository<Transaction>, users: Repository<User>);
    findMine(userId: string): Promise<Account[]>;
    getByIban(iban: string): Promise<Account>;
    transferInternal(userId: string, fromIban: string, toIban: string, amount: number, description?: string): Promise<{
        ok: boolean;
    }>;
}
