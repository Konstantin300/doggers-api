import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import * as admin from 'firebase-admin';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}
  async create(userId: string, images: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException(
        { message: 'User is not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const uploadedImages = await Promise.all(
      images.file.map(async (image) => {
        const url = await this.uploadFileWithFirebase(image);
        const result = await this.imageRepository.save({
          userId,
          imageUrl: url.toString(),
        });
        return result;
      }),
    );

    return uploadedImages;
  }

  async uploadFileWithFirebase(file) {
    const bucket = admin.storage().bucket();

    const filename = file.originalname;

    await bucket.file(filename).save(file.buffer);
    // .then((res) => console.log('--', res));
    const bucketFile = bucket.file(filename);

    const urls = await bucketFile.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });
    return urls;
  }

  async getAllImagesFromFireBase() {
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles();
    const fileNames = files.map(
      (file) => (file.name, console.log('file.name', file.name)),
    );
    return fileNames;
  }

  async findAll(id: string) {
    return await this.imageRepository.find({ where: { userId: id } });
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  async update(userId: string, file: any) {
    const user = this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException(
        { message: 'User with this id is not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const newImageUrl = await this.uploadFileWithFirebase(file);

    return await this.imageRepository.save({
      userId,
      imageUrl: newImageUrl.toString(),
    });
  }

  async remove(id: string) {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
    console.log('id', id);
    const deletedImageFromFirebase = await this.deleteImageFromFirebase(
      image.imageUrl,
    );

    if (deletedImageFromFirebase) {
      console.log('srabotalo');
      return await this.imageRepository.delete({ id });
    }

    // return await this.imageRepository.delete({ id });
  }

  async deleteImageFromFirebase(imageUrl: string) {
    const image = await this.imageRepository.findOne({ where: { imageUrl } });

    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    const bucket = admin.storage().bucket();
    const urlObj = new URL(imageUrl);
    const filename = urlObj.pathname.split('/').pop();

    try {
      await bucket.file(filename).delete();

      return true;
    } catch (e) {
      console.log('error', e);
      throw new HttpException(
        'Failed to delete image from firebase',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
