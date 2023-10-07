import { Post } from 'src/post/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: `imageUrl`, type: 'text', nullable: true })
  imageUrl: string;

  @Column({ name: 'userId' })
  userId: string;

  @ManyToMany(() => Post, (post) => post.id, { cascade: true })
  posts: Post[];
}
