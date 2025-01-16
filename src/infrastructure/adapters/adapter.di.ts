import { container } from 'tsyringe';
import { BookRepository, UserRepository } from '../../core/ports/database.port';
import Logger from '../../core/ports/logger.port';
import { TypeORMBookRepository } from './type-orm/book/book.repository';
import {
  LogLevel,
  WinstonLogger,
} from './winston-logger/winston-logger.adapter';
import loggerConfig from './winston-logger/winston-logger.config';
import TypeORMUserRepository from './type-orm/user/user.repository';
container.register<Logger>('logger', {
  useValue: new WinstonLogger(loggerConfig.logLevel as LogLevel),
});
container.register<BookRepository>('logger', {
  useValue: new TypeORMBookRepository(),
});
container.register<UserRepository>('logger', {
  useValue: new TypeORMUserRepository(),
});
