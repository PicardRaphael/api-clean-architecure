import { z } from 'zod';
import { BookOutputDto } from './books';

export const PostBookInputDto = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  author: z.string().min(1),
  totalPages: z.number().min(1),
});
export type PostBookInputDto = z.infer<typeof PostBookInputDto>;
export const PostBookOutputDto = BookOutputDto;
export type PostBookOutputDto = z.infer<typeof PostBookOutputDto>;
