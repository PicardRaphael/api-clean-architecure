import { PostUsersInputDto } from './dto';

export const createUserCodec = {
  decode: (params: unknown) => PostUsersInputDto.safeParse(params),
};
