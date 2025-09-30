import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private svc;
    constructor(svc: TransactionsService);
    list(iban: string): Promise<import("./transaction.entity").Transaction[]>;
}
