import { Book } from '../entities/book.interface';
import { ExistingUser } from '../entities/user.entity';

export interface CreateBookInput {
  title: string;
  summary: string;
  author: string;
  totalPages: number;
}
export interface CreateUserInput {
  login: string;
  password: string;
}

export interface BookRepository {
  findById(id: string): Promise<Book | null>;
  create(args: CreateBookInput): Promise<Book>;
  delete(id: string): Promise<boolean>;
  list(): Promise<Book[]>;
}

export interface UserRepository {
  create(args: CreateUserInput): Promise<ExistingUser | 'USER_ALREADY_EXISTS'>;
  findByLoginPassword(
    login: string,
    password: string,
  ): Promise<ExistingUser | null>;
  findById(id: string): Promise<ExistingUser | null>;
}
