import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
export declare class TransactionsService {
    private tx;
    constructor(tx: Repository<Transaction>);
    listByAccount(iban: string): Promise<Transaction[]>;
}
