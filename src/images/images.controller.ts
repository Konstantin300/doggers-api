import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import multer from 'multer';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Delete('firebase/:id')
  async removeImageFromFirebase(@Param('id') id: string) {
    return this.imagesService.deleteImageFromFirebase(id);
  }

  @ApiConsumes('multipart/form-data')
  @Post(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 6 }]))
  create(
    @UploadedFiles()
    file: {
      avatarImages?: Array<multer.Multer.File>;
    },
    @Param('id') userId: string,
  ) {
    console.log('file', file);
    return this.imagesService.create(userId, file);
  }

  @Get(':id')
  findAll(@Param('id') userId: string) {
    return this.imagesService.findAll(userId);
  }

  @Get('/firebase')
  getAllImagesFromFireBase() {
    return this.imagesService.getAllImagesFromFireBase();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile()
    file: multer.Multer.File,
    @Param('id') userId: string,
  ) {
    return this.imagesService.update(userId, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }
}
