"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    var _a;
    return ({
        port: parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000', 10),
        jwt: {
            secret: process.env.JWT_SECRET || 'dev',
            expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
        },
        db: {
            url: process.env.DATABASE_URL,
        },
    });
};
//# sourceMappingURL=configuration.js.map