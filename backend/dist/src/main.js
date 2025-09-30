"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const port = Number(process.env.PORT) || 3000;
    await app.listen(port, '0.0.0.0');
    const url = `http://127.0.0.1:${port}`;
    console.log('\n========================================');
    console.log(`✅ API listening at ${url}`);
    console.log('========================================\n');
}
bootstrap();
//# sourceMappingURL=main.js.map