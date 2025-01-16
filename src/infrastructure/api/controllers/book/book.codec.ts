import { BookIdDto, PostBookInputDto } from './dto';

export const getBookCodec = {
  decodeBookId: (params: unknown) => BookIdDto.safeParse(params),
};
export const createBookCodec = {
  decode: (params: unknown) => PostBookInputDto.safeParse(params),
};
