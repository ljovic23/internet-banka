import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private users;
    constructor(users: Repository<User>);
    createAdmin: () => Promise<void>;
}
