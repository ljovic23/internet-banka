import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Account } from '../accounts/account.entity';
import { Transaction } from '../transactions/transaction.entity'; // ✅ DODANO
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const ds = new DataSource({
  type: 'sqlite',
  database: 'bank.db',
  entities: [User, Account, Transaction], // ✅ DODANO
  synchronize: true,
});



async function run() {
  await ds.initialize();
  const userRepo = ds.getRepository(User);
  const accRepo = ds.getRepository(Account);

  const u1 = userRepo.create({
    email: 'pera@bank.hr',
    fullName: 'Pero Perić',
    passwordHash: await bcrypt.hash('test1234', 10),
  });
  const u2 = userRepo.create({
    email: 'ana@bank.hr',
    fullName: 'Ana Anić',
    passwordHash: await bcrypt.hash('test1234', 10),
  });
  await userRepo.save([u1, u2]);

  await accRepo.save([
    accRepo.create({ iban: 'HR1122334455667788', balance: '1500.00', owner: u1 }),
    accRepo.create({ iban: 'HR9988776655443322', balance: '800.00',   owner: u1 }),
    accRepo.create({ iban: 'HR0000111122223333', balance: '1200.00',  owner: u2 }),
  ]);

  console.log('Seed gotovo');
  await ds.destroy();
}
run();
