import 'reflect-metadata';

import { randomUUID } from 'crypto';
import { container } from 'tsyringe';

import { Book } from '../../src/core/entities/book.interface';
import { BookRepository } from '../../src/core/ports/database.port';
import Logger from '../../src/core/ports/logger.port';
import ListBookUseCase from '../../src/core/use-cases/book/list-book.use-case';

describe('ListBooks', () => {
  const mock__data: Book[] = [
    {
      id: randomUUID(),
      title: 'My title',
      author: 'My author',
      summary: 'My summary',
      totalPages: 100,
    },
    {
      id: randomUUID(),
      title: 'My title 2',
      author: 'My author 2',
      summary: 'My summary 2',
      totalPages: 200,
    },
  ];

  // mock repository
  const mock__list = jest.fn();
  const mock__BookRepository = () => {
    return {
      list: mock__list,
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

  it('should return the books list', async () => {
    mock__list.mockResolvedValue(mock__data);

    const response = await new ListBookUseCase().execute();

    expect(response).toStrictEqual(mock__data);
    expect(
      container.resolve<BookRepository>('BookRepository').list,
    ).toHaveBeenCalled();
  });
});
