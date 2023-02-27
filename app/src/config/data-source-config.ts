import path from 'path';
import { DataSourceOptions } from 'typeorm';
import { getEnvOrDefault, env } from '@config/env';

const DB_HOST = 'DB_HOST';
const DB_PORT = 'DB_PORT';
const DB_USERNAME = 'DB_USERNAME';
const DB_PASSWORD = 'DB_PASSWORD';
const DB_DATABASE = 'DB_DATABASE';

export const dataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  charset: 'utf8_general_ci',
  host: getEnvOrDefault(DB_HOST),
  port: getEnvOrDefault(DB_PORT),
  username: getEnvOrDefault(DB_USERNAME),
  password: getEnvOrDefault(DB_PASSWORD),
  database: getEnvOrDefault(DB_DATABASE),
  logging: false,
  synchronize: env('NODE_ENV') === 'development',
  entities: [path.join(process.cwd(), 'src', 'database', 'schemas', '*.ts')],
  subscribers: [],
  migrations: [
    path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts')
  ]
};
