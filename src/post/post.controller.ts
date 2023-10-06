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
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { JwtAuthGuard } from 'src/guards/jwt-guards';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':userId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 6 }]))
  async create(
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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 6 }]))
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFiles()
    file: {
      avatarImages?: Array<multer.Multer.File>;
    },
    @Body('title') title: string,
  ) {
    return await this.postService.update(id, req.user.id, title, file);
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
