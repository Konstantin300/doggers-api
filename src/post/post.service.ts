import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ImagesService } from 'src/images/images.service';
import { Image } from 'src/images/entities/image.entity';

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

  async update(id: string, title: string, images: any) {
    console.log('---');
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const imageUrls = await this.imagesService.create(id, images);

    post.title = title;

    console.log('post', post);

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
    console.log('allPosts', allPosts);
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
    console.log('77777', post);

    const imageDelete = await Promise.all(
      post.images.map(async (image) => {
        console.log('^^^', image);
        const result = await this.imagesService.remove(image.id);
        console.log('result', result);
        return result;
      }),
    );
    console.log('imageDelete', imageDelete);
    const deletedPost = await this.postRepository.delete(id);
    // const deletedImages = this.imagesService.remove(id);
    // console.log('deletedImages', deletedImages);
    console.log('deletedPost', deletedPost);
    return { deletedPost, imageDelete };
  }
}
