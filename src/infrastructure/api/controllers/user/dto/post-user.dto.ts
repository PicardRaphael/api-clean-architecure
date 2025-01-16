import { z } from 'zod';
import { UserOutputDto } from './user.dto';

export const PostUsersInputDto = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export type PostUsersInputDto = z.infer<typeof PostUsersInputDto>;

export const PostUsersOutputDto = UserOutputDto;
export type PostUsersOutputDto = z.infer<typeof PostUsersOutputDto>;
