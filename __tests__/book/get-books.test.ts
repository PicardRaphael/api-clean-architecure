import 'reflect-metadata';

import { randomUUID } from 'crypto';
import { container } from 'tsyringe';

import { Book } from '../../src/core/entities/book.interface';
import { BookRepository } from '../../src/core/ports/database.port';
import Logger from '../../src/core/ports/logger.port';
import GetBookUseCase from '../../src/core/use-cases/book/get-book.use-case';

describe('GetBook', () => {
  const id: string = randomUUID();
  const mock__data: Book = {
    id,
    title: 'My title 2',
    author: 'My author 2',
    summary: 'My summary 2',
    totalPages: 200,
  };

  // mock repository
  const mock__findById = jest.fn();
  const mock__BookRepository = () => {
    return {
      findById: mock__findById,
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

  it('should return the book with id', async () => {
    mock__findById.mockResolvedValue(mock__data);

    const response = await new GetBookUseCase().execute(id);

    expect(response).toStrictEqual(mock__data);
    expect(
      container.resolve<BookRepository>('BookRepository').findById,
    ).toHaveBeenCalled();
  });
  it('should return not found with wrong id', async () => {
    mock__findById.mockResolvedValue(null);

    const response = await new GetBookUseCase().execute(id);

    expect(response).toStrictEqual('BOOK_NOT_FOUND');
  });
});
