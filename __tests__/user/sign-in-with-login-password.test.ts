import 'reflect-metadata';
import { container } from 'tsyringe';
import { UserRepository } from '../../src/core/ports/database.port';
import Logger from '../../src/core/ports/logger.port';
import SignInWithLoginPasswordUserUseCase from '../../src/core/use-cases/user/sign-in-with-login-password-user.use-case';

describe('User sign in with login and password', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.USER_SALT = 'test-salt';
  });

  const mock__findByLoginPassword = jest.fn();
  const mock__login = 'login';
  const mock__password = 'password';
  const mock__data = {
    accessToken: 'mocked-token',
  };
  const mock__UserRepository = () => {
    return {
      findByLoginPassword: mock__findByLoginPassword,
    };
  };
  container.register<Partial<UserRepository>>('UserRepository', {
    useValue: mock__UserRepository(),
  });
  container.register<Partial<Logger>>('Logger', {
    useValue: {
      debug: jest.fn(),
    },
  });
  it('should return the access token', async () => {
    mock__findByLoginPassword.mockResolvedValue({
      login: mock__login,
      password: mock__password,
      signAndEncodeUserAccessToken: jest.fn().mockReturnValue('mocked-token'),
    });
    const response = await new SignInWithLoginPasswordUserUseCase().execute(
      mock__login,
      mock__password,
    );
    expect(response).toStrictEqual(mock__data);
    expect(
      container.resolve<UserRepository>('UserRepository').findByLoginPassword,
    ).toHaveBeenCalled();
  });
  it('should return USER_NOT_FOUND when user does not exist', async () => {
    mock__findByLoginPassword.mockResolvedValue(null);
    const response = await new SignInWithLoginPasswordUserUseCase().execute(
      mock__login,
      mock__password,
    );
    expect(response).toBe('USER_NOT_FOUND');
  });
  it('should log debug message on execution', async () => {
    const logger = container.resolve<Logger>('Logger');
    mock__findByLoginPassword.mockResolvedValue({
      login: mock__login,
      password: mock__password,
      signAndEncodeUserAccessToken: jest.fn().mockReturnValue('mocked-token'),
    });
    await new SignInWithLoginPasswordUserUseCase().execute(
      mock__login,
      mock__password,
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'SignInWithLoginPasswordUserUseCase.execute',
    );
  });
});
