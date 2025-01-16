import { container } from 'tsyringe';
import { NotExistingUser } from '../../entities/user.entity';
import { UserRepository } from '../../ports/database.port';
import Logger from '../../ports/logger.port';

class SignInWithLoginPasswordUserUseCase {
  private logger: Logger;
  private userRepository: UserRepository;
  constructor() {
    this.logger = container.resolve<Logger>('Logger');
    this.userRepository = container.resolve<UserRepository>('UserRepository');
  }
  async execute(
    login: string,
    password: string,
  ): Promise<{ accessToken: string } | 'USER_NOT_FOUND'> {
    this.logger.debug('SignInWithLoginPasswordUserUseCase.execute');
    const notExistingUser = new NotExistingUser();
    const existingUser = await this.userRepository.findByLoginPassword(
      login,
      notExistingUser.hashPassword(password),
    );

    return existingUser
      ? { accessToken: existingUser.signAndEncodeUserAccessToken() }
      : 'USER_NOT_FOUND';
  }
}
export default SignInWithLoginPasswordUserUseCase;
