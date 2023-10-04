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

    // const imageEntities: Image[] = imageUrls.imageUrl.map((obj) => {
    //   return obj.imageUrl;
    // });
    // const imageEntities: Image[] = imageUrls.map((imageUrl) => {
    //   const img = new Image();
    //   img.imageUrl = imageUrl;
    //   img.userId = user.id;
    //   return img;
    // });

    // const imageEntities = await Promise.all(
    //   imageUrls.map(async (imageUrl) => {
    //     const image = new Image();
    //     image.imageUrl = imageUrl;
    //     image.userId = user.id;
    //     return image;
    //   }),
    // );

    const post = new Post();
    const imageEntities = await Promise.all(
      imageUrls.map(async (imageUrl) => {
        post.images = imageUrl;
        return;
      }),
    );

    post.title = title;

    post.user = user;

    const savedPost = await this.postRepository.save(post);

    // await this.postRepository
    //   .createQueryBuilder('post')
    //   .relation(Post, 'images')
    //   .of(savedPost)
    //   .loadMany();
    return savedPost;
  }

  findAll() {
    return this.postRepository.find({ relations: ['images'] });
  }

  findOne(id: string) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.find({
      where: { id },
      relations: ['images'],
    });
    // post.title = updatePostDto.title;

    const newSavedPost = await this.postRepository.save(post);
    // console.log('NNNNN', post);
    // console.log('44444', updatePostDto);
    return newSavedPost;
  }

  async remove(id: string) {
    const post = await this.postRepository.find({
      where: { id },
      relations: ['images'],
    });
    console.log('77777', post);

    // const imageDelete = await Promise.all(
    //   post.images.map(async (image) => {
    //     console.log('^^^', image);
    //     const result = await this.imagesService.remove(image.id);
    //     console.log('result', result);
    //     return result;
    //   }),
    // );
    // console.log('imageDelete', imageDelete);
    // const deletedPost = this.postRepository.delete(id);
    // // const deletedImages = this.imagesService.remove(id);
    // return { deletedPost, imageDelete };
  }
}
