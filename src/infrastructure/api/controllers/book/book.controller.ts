import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { createBookCodec, getBookCodec } from './book.codec';

import { InvalidInputError, NotFoundError } from '../../error-handler';
import { create, deleteById, getById, list } from './book.service';

// For TSOA generation, use the service's param type instead of the zod model directly
type CreateBookParams = Parameters<typeof create>[0];

@Route('books')
@Tags('Books')
@Security('jwt')
export class BookController extends Controller {
  constructor() {
    super();
  }

  /**
   * @summary Get all books
   */
  @Get()
  @SuccessResponse(200)
  async list() {
    return list();
  }

  /**
   * @summary Get a book by id
   * @param id The book's identifier
   */
  @Get('{id}')
  @SuccessResponse(200)
  @Response(400, 'Invalid book id format')
  @Response(404, 'Not found')
  async getById(@Path() id: string) {
    const bookId = getBookCodec.decodeBookId(id);

    if (!bookId.success) {
      throw new InvalidInputError('Invalid book id format');
    }

    const book = await getById(bookId.data);

    if (book === 'BOOK_NOT_FOUND') {
      throw new NotFoundError('BOOK_NOT_FOUND');
    }

    return book;
  }

  /**
   * @summary Create book
   */
  @Post()
  @SuccessResponse(201)
  @Response(400, 'Invalid request params')
  async create(@Body() requestBody: CreateBookParams) {
    const decodingResult = createBookCodec.decode(requestBody);

    if (!decodingResult.success) {
      throw new InvalidInputError(decodingResult.error.toString());
    }

    return create(decodingResult.data);
  }

  /**
   * @summary Delete book
   * @param id The book's identifier
   */
  @Delete('{id}')
  @SuccessResponse(204)
  @Response(400, 'Invalid book id format')
  @Response(404, 'Not found')
  async delete(@Path() id: string): Promise<void> {
    const bookId = getBookCodec.decodeBookId(id);

    if (!bookId.success) {
      throw new InvalidInputError('Invalid book id format');
    }

    const result = await deleteById(bookId.data);

    if (result === 'BOOK_NOT_FOUND') {
      throw new NotFoundError('BOOK_NOT_FOUND');
    }
  }
}
