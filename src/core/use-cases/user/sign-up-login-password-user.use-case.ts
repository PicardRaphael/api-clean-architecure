import { container } from 'tsyringe';
import { NotExistingUser } from '../../entities/user.entity';
import { CreateUserInput, UserRepository } from '../../ports/database.port';
import Logger from '../../ports/logger.port';

class SignUpWithLoginPasswordUserUseCase {
  private logger: Logger;
  private userRepository: UserRepository;
  constructor() {
    this.logger = container.resolve<Logger>('Logger');
    this.userRepository = container.resolve<UserRepository>('UserRepository');
  }
  async execute({
    login,
    password,
  }: CreateUserInput): Promise<
    { accessToken: string } | 'USER_ALREADY_EXISTS'
  > {
    this.logger.debug('SignUpWithLoginPasswordUserUseCase.execute');
    const notExistingUser = new NotExistingUser();
    const existingUser = await this.userRepository.create({
      login,
      password: notExistingUser.hashPassword(password),
    });

    if (existingUser === 'USER_ALREADY_EXISTS') {
      return existingUser;
    }
    return {
      accessToken: existingUser.signAndEncodeUserAccessToken(),
    };
  }
}
export default SignUpWithLoginPasswordUserUseCase;
