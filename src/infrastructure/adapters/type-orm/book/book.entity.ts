import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Book as BookCoreEntity } from '../../../../core/entities/book.interface';
@Entity()
class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  summary: string;
  @Column()
  author: string;
  @Column()
  totalPages: number;

  @Column({
    type: 'time without time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  toDomainEntity(): BookCoreEntity {
    return {
      id: this.id,
      title: this.title,
      summary: this.summary,
      author: this.author,
      totalPages: this.totalPages,
    };
  }
}
export default Book;
