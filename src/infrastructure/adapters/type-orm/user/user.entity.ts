import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExistingUser } from '../../../../core/entities/user.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({
    type: 'time without time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  toDomainEntity(): ExistingUser {
    return new ExistingUser({ id: this.id });
  }
}
export default User;
