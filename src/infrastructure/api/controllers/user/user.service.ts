import SignInWithLoginPasswordUserUseCase from '../../../../core/use-cases/user/sign-in-with-login-password-user.use-case';
import SignUpWithLoginPasswordUserUseCase from '../../../../core/use-cases/user/sign-up-login-password-user.use-case';
import { PostUsersInputDto, PostUsersOutputDto } from './dto';

export const signin = (
  login: string,
  password: string,
): Promise<PostUsersOutputDto | 'USER_NOT_FOUND'> =>
  new SignInWithLoginPasswordUserUseCase().execute(login, password);

export const signup = (
  data: PostUsersInputDto,
): Promise<PostUsersOutputDto | 'USER_ALREADY_EXISTS'> =>
  new SignUpWithLoginPasswordUserUseCase().execute(data);
