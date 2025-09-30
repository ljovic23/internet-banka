import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';


@Injectable()
export class AccountsService {
constructor(
@InjectRepository(Account) private accounts: Repository<Account>,
@InjectRepository(Transaction) private tx: Repository<Transaction>,
@InjectRepository(User) private users: Repository<User>,
) {}


async findMine(userId: string) { return this.accounts.find({ where: { owner: { id: userId } } }); }


async getByIban(iban: string) { const a = await this.accounts.findOne({ where: { iban } }); if (!a) throw new NotFoundException('Račun ne postoji'); return a; }


async transferInternal(userId: string, fromIban: string, toIban: string, amount: number, description?: string) {
if (amount <= 0) throw new BadRequestException('Iznos mora biti > 0');
if (fromIban === toIban) throw new BadRequestException('IBAN mora biti različit');


const from = await this.getByIban(fromIban);
const to = await this.getByIban(toIban);
if (from.owner.id !== userId) throw new BadRequestException('Nije vaš račun');


const queryRunner = this.accounts.manager.connection.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();
try {
const fromBal = Number(from.balance);
if (fromBal < amount) throw new BadRequestException('Nedovoljno sredstava');
from.balance = (fromBal - amount).toFixed(2);
to.balance = (Number(to.balance) + amount).toFixed(2);
await queryRunner.manager.save([from, to]);
await queryRunner.manager.save(this.tx.create({ account: from, amount: (-amount).toFixed(2), type: 'INTERNAL_TRANSFER', counterpartyIban: to.iban, description }));
await queryRunner.manager.save(this.tx.create({ account: to, amount: amount.toFixed(2), type: 'INTERNAL_TRANSFER', counterpartyIban: from.iban, description }));
await queryRunner.commitTransaction();
return { ok: true };
} catch (e) {
await queryRunner.rollbackTransaction();
throw e;
} finally {
await queryRunner.release();
}
}
}