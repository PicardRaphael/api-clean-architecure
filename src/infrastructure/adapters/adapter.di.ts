import { container } from 'tsyringe';

import Logger from '../../core/ports/logger.port';
import {
  LogLevel,
  WinstonLogger,
} from './winston-logger/winston-logger.adapter';
import loggerConfig from './winston-logger/winston-logger.config';

import { BookRepository, UserRepository } from '../../core/ports/database.port';
import TypeORMBookRepository from './type-orm/book/book.repository';
import TypeORMUserRepository from './type-orm/user/user.repository';

container
  .register<Logger>('Logger', {
    useValue: new WinstonLogger(loggerConfig.logLevel as LogLevel),
  })
  .register<BookRepository>('BookRepository', {
    useValue: new TypeORMBookRepository(),
  })
  .register<UserRepository>('UserRepository', {
    useValue: new TypeORMUserRepository(),
  });
