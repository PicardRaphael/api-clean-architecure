import { ExistingUser } from '../../../../core/entities/user.entity';
import {
  CreateUserInput,
  UserRepository,
} from '../../../../core/ports/database.port';
import { AppDataSource, isInitialized } from '../data-source';
import UserDBEntity from './user.entity';
class TypeORMUserRepository implements UserRepository {
  async create({
    login,
    password,
  }: CreateUserInput): Promise<ExistingUser | 'USER_ALREADY_EXISTS'> {
    await isInitialized();
    const isExist = await AppDataSource.getRepository(UserDBEntity).exists({
      where: { login },
    });

    if (isExist) {
      return 'USER_ALREADY_EXISTS';
    }
    const userIdentifier = (
      await AppDataSource.getRepository(UserDBEntity).insert({
        login,
        password,
      })
    ).identifiers.at(0);

    if (!userIdentifier) {
      throw new Error('User entity creation failed');
    }

    const user = await AppDataSource.getRepository(UserDBEntity).findOneBy({
      id: userIdentifier.id,
    });

    if (!user) {
      throw 'User creation failed';
    }
    return user.toDomainEntity();
  }

  async findByLoginPassword(
    login: string,
    password: string,
  ): Promise<ExistingUser | null> {
    await isInitialized();
    const user = await AppDataSource.getRepository(UserDBEntity).findOne({
      where: { login, password },
    });
    return user ? user.toDomainEntity() : null;
  }
  async findById(id: string): Promise<ExistingUser | null> {
    await isInitialized();
    const user = await AppDataSource.getRepository(UserDBEntity).findOne({
      where: { id },
    });
    return user ? user.toDomainEntity() : null;
  }
}
export default TypeORMUserRepository;
