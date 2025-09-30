import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';


@Injectable()
export class TransactionsService {
constructor(@InjectRepository(Transaction) private tx: Repository<Transaction>) {}


listByAccount(iban: string) {
return this.tx.find({ where: { account: { iban } }, order: { createdAt: 'DESC' }, take: 100 });
}
}