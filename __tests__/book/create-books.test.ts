import 'reflect-metadata';

import { container } from 'tsyringe';

import { randomUUID } from 'crypto';
import { Book } from '../../src/core/entities/book.interface';
import { BookRepository } from '../../src/core/ports/database.port';
import Logger from '../../src/core/ports/logger.port';
import CreateBookUseCase from '../../src/core/use-cases/book/create-book.use-case';

describe('CreateBook', () => {
  const mock__data: Book = {
    id: randomUUID(),
    title: 'My title 2',
    author: 'My author 2',
    summary: 'My summary 2',
    totalPages: 200,
  };

  // mock repository
  const mock__create = jest.fn();
  const mock__BookRepository = () => {
    return {
      create: mock__create,
    };
  };

  container.register<Partial<BookRepository>>('BookRepository', {
    useValue: mock__BookRepository(),
  });

  // mock logger
  container.register<Partial<Logger>>('Logger', {
    useValue: {
      debug: jest.fn(),
    },
  });

  it('should create the book', async () => {
    mock__create.mockResolvedValue(mock__data);
    const body = {
      title: 'My title 2',
      author: 'My author 2',
      summary: 'My summary 2',
      totalPages: 200,
    };
    const response = await new CreateBookUseCase().execute(body);

    expect(response).toStrictEqual(mock__data);
    expect(
      container.resolve<BookRepository>('BookRepository').create,
    ).toHaveBeenCalledWith(body);
  });
});
