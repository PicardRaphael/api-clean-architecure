import { Book } from '../../../../core/entities/book.interface';
import CreateBookUseCase from '../../../../core/use-cases/book/create-book.use-case';
import DeleteBookUseCase from '../../../../core/use-cases/book/delete-book.use-case';
import GetBookUseCase from '../../../../core/use-cases/book/get-book.use-case';
import ListBookUseCase from '../../../../core/use-cases/book/list-book.use-case';
import { GetBookOutputDto, GetBooksOutputDto, PostBookInputDto } from './dto';

export const list = (): Promise<GetBooksOutputDto> => {
  return new ListBookUseCase().execute();
};

export const getById = (
  id: string,
): Promise<GetBookOutputDto | 'BOOK_NOT_FOUND'> => {
  return new GetBookUseCase().execute(id);
};

export const create = (data: PostBookInputDto): Promise<Book> => {
  return new CreateBookUseCase().execute(data);
};

export const deleteById = (id: string): Promise<void | 'BOOK_NOT_FOUND'> => {
  return new DeleteBookUseCase().execute(id);
};
