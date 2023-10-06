import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly imagesService: ImagesService,
  ) {}

  async createPost(userId: string, title: string, images: any) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const imageUrls = await this.imagesService.create(userId, images);

    const post = new Post();
    post.title = title;
    post.user = user;
    post.images = imageUrls;

    const savedPost = await this.postRepository.save(post);

    return savedPost;
  }

  async update(id: string, userId: string, title: string, images: any) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const imageUrls = await this.imagesService.create(userId, images);
    console.log('imageUrls', imageUrls);

    post.title = title;
    post.images = imageUrls;

    if (imageUrls) {
      await Promise.all(
        post.images.map(async (image) => {
          const result = await this.imagesService.remove(image.id);
          return result;
        }),
      );
    }

    const newSavedPost = await this.postRepository.save(post);
    return newSavedPost;
  }

  async findAll() {
    const allPosts = await this.postRepository.find({ relations: ['images'] });
    return allPosts;
  }

  async findOne(id: string) {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  async remove(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    const imageDelete = await Promise.all(
      post.images.map(async (image) => {
        const result = await this.imagesService.remove(image.id);
        return result;
      }),
    );
    const deletedPost = await this.postRepository.delete(id);
    return { deletedPost, imageDelete };
  }
}
