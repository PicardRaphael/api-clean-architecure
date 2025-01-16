import { container } from 'tsyringe';
import { BookRepository } from '../../ports/database.port';
import Logger from '../../ports/logger.port';

class DeleteBookUseCase {
  private logger: Logger;
  private bookRepository: BookRepository;
  constructor() {
    this.logger = container.resolve<Logger>('Logger');
    this.bookRepository = container.resolve<BookRepository>('BookRepository');
  }
  async execute(id: string): Promise<void | 'BOOK_NOT_FOUND'> {
    this.logger.debug('DeleteBookUseCase.execute');
    const data = await this.bookRepository.delete(id);
    if (!data) {
      return 'BOOK_NOT_FOUND';
    }
  }
}
export default DeleteBookUseCase;
