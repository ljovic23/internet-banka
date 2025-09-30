import { Account } from '../accounts/account.entity';
type TxType = 'INTERNAL_TRANSFER' | 'EXTERNAL_PAYMENT' | 'CARD' | 'FEE';
export declare class Transaction {
    id: string;
    account: Account;
    amount: string;
    type: TxType;
    counterpartyIban: string;
    description: string;
    createdAt: Date;
}
export {};
