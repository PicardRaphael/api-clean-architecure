import { container } from 'tsyringe';
import { Book } from '../../entities/book.interface';
import { BookRepository } from '../../ports/database.port';
import Logger from '../../ports/logger.port';

class ListBookUseCase {
  private logger: Logger;
  private bookRepository: BookRepository;
  constructor() {
    this.logger = container.resolve<Logger>('Logger');
    this.bookRepository = container.resolve<BookRepository>('BookRepository');
  }
  async execute(): Promise<Book[]> {
    this.logger.debug('ListBookUseCase.execute');
    return this.bookRepository.list();
  }
}
export default ListBookUseCase;
