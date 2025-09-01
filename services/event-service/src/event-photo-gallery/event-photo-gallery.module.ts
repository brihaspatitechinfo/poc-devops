import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventPhotoGallery } from './entities/event-photo-gallery.entity';
import { EventPhotoGalleryController } from './event-photo-gallery.controller';
import { EventPhotoGalleryService } from './event-photo-gallery.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventPhotoGallery])],
    controllers: [EventPhotoGalleryController],
    providers: [EventPhotoGalleryService],
    exports: [EventPhotoGalleryService],
})
export class EventPhotoGalleryModule { } 