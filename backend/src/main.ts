import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Account } from './accounts/account.entity';
import * as bcrypt from 'bcryptjs';

async function seedIfEmpty(app) {
  try {
    const ds = app.get(DataSource);

    const userRepo = ds.getRepository(User);
    const accRepo = ds.getRepository(Account);

    const count = await userRepo.count();
    if (count > 0) {
      console.log('Seed: već postoje korisnici – preskačem.');
      return;
    }

    console.log('Seed: kreiram demo korisnika i račune…');
    const passwordHash = await bcrypt.hash('test1234', 10);

    const user = userRepo.create({
      email: 'pera@bank.hr',
      fullName: 'Pero Perić',
      role: 'user' as any,
      passwordHash,
    });
    await userRepo.save(user);

    const a1 = accRepo.create({
      iban: 'HR1122334455667788',
      balance: 1500,
      user,
    });
    const a2 = accRepo.create({
      iban: 'HR0000111122223333',
      balance: 800,
      user,
    });
    await accRepo.save([a1, a2]);

    console.log('Seed: gotovo. Login -> pera@bank.hr / test1234');
  } catch (e) {
    console.error('Seed error:', e);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://**.netlify.app',
      'https://endearing-valkyrie-86d278.netlify.app', 
    ],
    credentials: true,
  });

  await seedIfEmpty(app);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`API listening at http://0.0.0.0:${port}`);
}
bootstrap();
