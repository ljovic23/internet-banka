import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { IsNumber, IsString } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';


class TransferDto { @IsString() fromIban: string; @IsString() toIban: string; @IsNumber() amount: number; @IsString() description?: string; }


@Controller('accounts')
@UseGuards(AuthGuard('jwt'))
export class AccountsController {
constructor(private svc: AccountsService) {}


@Get('mine') mine(@Req() req: any) { return this.svc.findMine(req.user.userId); }


@Post('transfer') transfer(@Req() req: any, @Body() dto: TransferDto) { return this.svc.transferInternal(req.user.userId, dto.fromIban, dto.toIban, dto.amount, dto.description); }
}