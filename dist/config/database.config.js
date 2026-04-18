"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const parseBoolean = (value, fallback) => {
    if (value === undefined) {
        return fallback;
    }
    return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};
const getDatabaseConfig = (configService) => {
    const sslEnabled = parseBoolean(configService.get('DB_SSL'), false);
    return {
        type: 'postgres',
        host: configService.get('DB_HOST') ?? 'localhost',
        port: Number(configService.get('DB_PORT') ?? '5432'),
        username: configService.get('DB_USERNAME') ?? 'postgres',
        password: configService.get('DB_PASSWORD') ?? 'postgres',
        database: configService.get('DB_NAME') ?? 'cvpilot',
        schema: configService.get('DB_SCHEMA') ?? 'public',
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        autoLoadEntities: true,
        synchronize: parseBoolean(configService.get('DB_SYNCHRONIZE'), false),
        logging: parseBoolean(configService.get('DB_LOGGING'), false),
    };
};
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map