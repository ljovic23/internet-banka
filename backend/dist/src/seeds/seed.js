"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const account_entity_1 = require("../accounts/account.entity");
const transaction_entity_1 = require("../transactions/transaction.entity");
const bcrypt = __importStar(require("bcryptjs"));
require("dotenv/config");
const ds = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'bank.db',
    entities: [user_entity_1.User, account_entity_1.Account, transaction_entity_1.Transaction],
    synchronize: true,
});
async function run() {
    await ds.initialize();
    const userRepo = ds.getRepository(user_entity_1.User);
    const accRepo = ds.getRepository(account_entity_1.Account);
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
        accRepo.create({ iban: 'HR9988776655443322', balance: '800.00', owner: u1 }),
        accRepo.create({ iban: 'HR0000111122223333', balance: '1200.00', owner: u2 }),
    ]);
    console.log('Seed gotovo');
    await ds.destroy();
}
run();
//# sourceMappingURL=seed.js.map