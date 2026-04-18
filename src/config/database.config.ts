import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const parseBoolean = (
  value: string | undefined,
  fallback: boolean,
): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const sslEnabled = parseBoolean(configService.get<string>('DB_SSL'), false);

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST') ?? 'localhost',
    port: Number(configService.get<string>('DB_PORT') ?? '5432'),
    username: configService.get<string>('DB_USERNAME') ?? 'postgres',
    password: configService.get<string>('DB_PASSWORD') ?? 'postgres',
    database: configService.get<string>('DB_NAME') ?? 'cvpilot',
    schema: configService.get<string>('DB_SCHEMA') ?? 'public',
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    autoLoadEntities: true,
    synchronize: parseBoolean(
      configService.get<string>('DB_SYNCHRONIZE'),
      false,
    ),
    logging: parseBoolean(configService.get<string>('DB_LOGGING'), false),
  };
};