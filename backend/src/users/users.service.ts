import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
constructor(@InjectRepository(User) private users: Repository<User>) {}
createAdmin = async () => {
const exists = await this.users.findOne({ where: { email: 'admin@bank.hr' } });
if (!exists) {
const u = this.users.create({ email: 'admin@bank.hr', fullName: 'Admin', passwordHash: await bcrypt.hash('admin123', 10), role: 'ADMIN' });
await this.users.save(u);
}
};
}