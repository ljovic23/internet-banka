import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';
export declare class Account {
    id: string;
    iban: string;
    balance: string;
    owner: User;
    transactions: Transaction[];
}
