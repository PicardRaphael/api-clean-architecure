import { Book } from '../../../../core/entities/book.interface';
import {
  BookRepository,
  CreateBookInput,
} from '../../../../core/ports/database.port';
import { AppDataSource, isInitialized } from '../data-source';
import BookDBEntity from './book.entity';
export class TypeORMBookRepository implements BookRepository {
  async findById(id: string): Promise<Book | null> {
    await isInitialized();
    const book = await AppDataSource.getRepository(BookDBEntity).findOne({
      where: { id },
    });
    return book ? book.toDomainEntity() : null;
  }

  /**
   * The function creates a new book entity in a database and returns the corresponding domain entity.
   * @param {CreateBookInput}  - The `create` function is an asynchronous function that takes in a
   * `CreateBookInput` object as a parameter. The `CreateBookInput` object typically contains the
   * following properties:
   * @returns The `create` function is returning a Promise that resolves to a `Book` object.
   */
  async create({
    title,
    summary,
    author,
    totalPages,
  }: CreateBookInput): Promise<Book> {
    await isInitialized();
    const bookIdentifier = (
      await AppDataSource.getRepository(BookDBEntity).insert({
        title,
        summary,
        author,
        totalPages,
      })
    ).identifiers.at(0);

    if (!bookIdentifier) {
      throw new Error('Book entity creation failed');
    }

    const book = await AppDataSource.getRepository(BookDBEntity).findOneBy({
      id: bookIdentifier.id,
    });

    if (!book) {
      throw 'Book creation failed';
    }
    return book.toDomainEntity();
  }

  /**
   * The `delete` function deletes a record from the BookDBEntity repository based on the provided id
   * and returns a boolean indicating the success of the operation.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * book entity that you want to delete from the database.
   * @returns The `delete` method is returning a Promise that resolves to a boolean value. The boolean
   * value indicates whether the deletion operation was successful or not. It checks if the number of
   * affected rows in the database after the deletion operation is equal to 1, and returns `true` if it
   * is, indicating that one record was successfully deleted.
   */
  async delete(id: string): Promise<boolean> {
    await isInitialized();
    const deleteResult = await AppDataSource.getRepository(BookDBEntity).delete(
      {
        id,
      },
    );
    return deleteResult.affected === 1;
  }

  /**
   * The list function asynchronously retrieves a list of books from the database and maps them to domain
   * entities.
   * @returns The `list` method returns a Promise that resolves to an array of `Book` domain entities.
   * The method first checks if the application is initialized using the `isInitialized` function, then
   * retrieves a list of books from the database using
   * `AppDataSource.getRepository(BookDBEntity).find()`. Finally, it maps the retrieved database entities
   * to domain entities using the `toDomainEntity` method before returning
   */
  async list(): Promise<Book[]> {
    await isInitialized();
    const books = await AppDataSource.getRepository(BookDBEntity).find();
    return books.map((book) => book.toDomainEntity());
  }
}
