import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':userId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 6 }]))
  async create(
    // @Body() createPostDto: CreatePostDto,
    @Body('title') title: string,

    @UploadedFiles()
    file: {
      avatarImages?: Array<multer.Multer.File>;
    },

    @Param('userId')
    userId: string,
  ) {
    return await this.postService.createPost(userId, title, file);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 6 }]))
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    file: {
      avatarImages?: Array<multer.Multer.File>;
    },
    @Body('title') title: string,
  ) {
    console.log('id', id);
    return await this.postService.update(id, title, file);
  }
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}