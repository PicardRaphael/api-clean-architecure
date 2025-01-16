import { z } from 'zod';
import { BookOutputDto } from './books';

export const GetBookOutputDto = BookOutputDto;
export type GetBookOutputDto = z.infer<typeof GetBookOutputDto>;

export const GetBooksOutputDto = z.array(GetBookOutputDto);
export type GetBooksOutputDto = z.infer<typeof GetBooksOutputDto>;

export const BookIdDto = z.string().uuid();
