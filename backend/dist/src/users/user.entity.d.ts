import { Account } from '../accounts/account.entity';
export type Role = 'USER' | 'ADMIN';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: Role;
    accounts: Account[];
}
