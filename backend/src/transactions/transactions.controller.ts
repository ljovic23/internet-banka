import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
constructor(private svc: TransactionsService) {}
@Get(':iban') list(@Param('iban') iban: string) { return this.svc.listByAccount(iban); }
}