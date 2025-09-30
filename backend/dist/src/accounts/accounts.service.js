"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const account_entity_1 = require("./account.entity");
const user_entity_1 = require("../users/user.entity");
const transaction_entity_1 = require("../transactions/transaction.entity");
let AccountsService = class AccountsService {
    constructor(accounts, tx, users) {
        this.accounts = accounts;
        this.tx = tx;
        this.users = users;
    }
    async findMine(userId) { return this.accounts.find({ where: { owner: { id: userId } } }); }
    async getByIban(iban) { const a = await this.accounts.findOne({ where: { iban } }); if (!a)
        throw new common_1.NotFoundException('Račun ne postoji'); return a; }
    async transferInternal(userId, fromIban, toIban, amount, description) {
        if (amount <= 0)
            throw new common_1.BadRequestException('Iznos mora biti > 0');
        if (fromIban === toIban)
            throw new common_1.BadRequestException('IBAN mora biti različit');
        const from = await this.getByIban(fromIban);
        const to = await this.getByIban(toIban);
        if (from.owner.id !== userId)
            throw new common_1.BadRequestException('Nije vaš račun');
        const queryRunner = this.accounts.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const fromBal = Number(from.balance);
            if (fromBal < amount)
                throw new common_1.BadRequestException('Nedovoljno sredstava');
            from.balance = (fromBal - amount).toFixed(2);
            to.balance = (Number(to.balance) + amount).toFixed(2);
            await queryRunner.manager.save([from, to]);
            await queryRunner.manager.save(this.tx.create({ account: from, amount: (-amount).toFixed(2), type: 'INTERNAL_TRANSFER', counterpartyIban: to.iban, description }));
            await queryRunner.manager.save(this.tx.create({ account: to, amount: amount.toFixed(2), type: 'INTERNAL_TRANSFER', counterpartyIban: from.iban, description }));
            await queryRunner.commitTransaction();
            return { ok: true };
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(account_entity_1.Account)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map