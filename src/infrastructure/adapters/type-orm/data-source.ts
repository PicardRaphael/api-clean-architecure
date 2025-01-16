import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { z } from 'zod';
import Book from './book/book.entity';
import migrations from './migrations';
import notTypeSafeConfig from './type-orm.config';
import User from './user/user.entity';

const ConfigSchema = z.object({
  host: z.string().min(1),
  port: z.coerce.number().min(1).max(65535),
  username: z.string().min(1),
  password: z.string().min(1),
  database: z.string().min(1),
});

const config = ConfigSchema.parse(notTypeSafeConfig);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: false,
  logging: true,
  migrations,
  migrationsRun: true,
  entities: [Book, User],
  namingStrategy: new SnakeNamingStrategy(),
});

export const isInitialized = async (): Promise<boolean> => {
  if (AppDataSource.isInitialized) return Promise.resolve(true);
  return AppDataSource.initialize()
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
};
