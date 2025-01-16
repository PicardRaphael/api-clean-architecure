import { container } from 'tsyringe';
import { Book } from '../../entities/book.interface';
import { BookRepository, CreateBookInput } from '../../ports/database.port';
import Logger from '../../ports/logger.port';

class CreateBookUseCase {
  private logger: Logger;
  private bookRepository: BookRepository;
  constructor() {
    this.logger = container.resolve<Logger>('Logger');
    this.bookRepository = container.resolve<BookRepository>('BookRepository');
  }
  async execute({
    title,
    summary,
    author,
    totalPages,
  }: CreateBookInput): Promise<Book> {
    this.logger.debug('CreateBookUseCase.execute');
    return this.bookRepository.create({
      title,
      summary,
      author,
      totalPages,
    });
  }
}
export default CreateBookUseCase;
