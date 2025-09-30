import { AccountsService } from './accounts.service';
declare class TransferDto {
    fromIban: string;
    toIban: string;
    amount: number;
    description?: string;
}
export declare class AccountsController {
    private svc;
    constructor(svc: AccountsService);
    mine(req: any): Promise<import("./account.entity").Account[]>;
    transfer(req: any, dto: TransferDto): Promise<{
        ok: boolean;
    }>;
}
export {};
