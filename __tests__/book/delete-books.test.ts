import 'reflect-metadata';

import { randomUUID } from 'crypto';
import { container } from 'tsyringe';

import { BookRepository } from '../../src/core/ports/database.port';
import Logger from '../../src/core/ports/logger.port';
import DeleteBookUseCase from '../../src/core/use-cases/book/delete-book.use-case';

describe('DeleteBook', () => {
  const id: string = randomUUID();
  // mock repository
  const mock__delete = jest.fn();
  const mock__BookRepository = () => {
    return {
      delete: mock__delete,
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

  it('should delete the book with id', async () => {
    mock__delete.mockResolvedValue(true);

    const response = await new DeleteBookUseCase().execute(id);

    expect(response).toBe(undefined);
    expect(
      container.resolve<BookRepository>('BookRepository').delete,
    ).toHaveBeenCalled();
  });
  it('should return not found with wrong id', async () => {
    mock__delete.mockResolvedValue(false);

    const response = await new DeleteBookUseCase().execute(id);

    expect(response).toStrictEqual('BOOK_NOT_FOUND');
  });
});
