import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, QueryRunner, Raw, Repository } from 'typeorm';
import { EventLocations } from '../event-locations/entities/event-locations.entity';
import { EventPhotoGallery } from '../event-photo-gallery/entities/event-photo-gallery.entity';
import { EventPrice } from '../event-prices/entities/event-price.entity';
import { EventQuestion } from '../event-questions/entities/event-question.entity';
import { EventSpeaker } from '../event-speakers/entities/event-speaker.entity';
import { EventsCategory } from '../events-category/entities/events-category.entity';
import { FileService } from '../file/file.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventTagRelationship } from '../event-tag-relationships/entities/event-tag-relationship.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private dataSource: DataSource,
    private fileService: FileService,
  ) { }

  async findAll(active: boolean, page: number, limit: number) {
    try {
      const whereClause = active ? { isActive: true } : {};
      const skip = (page - 1) * limit;
      const [events, total] = await this.eventRepository.findAndCount({
        skip,
        take: limit,
        where: whereClause,
        order: { startDate: 'ASC' },
      });
      return {
        events,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch events: ${error.message}`);
    }
  }

  async findOne(eventId: number) {
    try {
      const event = await this.eventRepository.findOne({ where: { eventId } });
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch event: ${error.message}`);
    }
  }

  async create(createEventDto: CreateEventDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {
        searchTags,
        speakers,
        questionnaire,
        photoGallery,
        countryId,
        stateId,
        cityId,
        category,
        price,
        ...eventData
      } = createEventDto;
      // if (createEventDto.eventImage) {
      // const eventImage = await this.fileService.saveEventImage(createEventDto.eventImage, event.eventId);
      // }
      const event = await queryRunner.manager.save(Event, eventData);
      await Promise.all([
        this.savePrices(queryRunner, price, event.eventId),
        this.saveCategories(queryRunner, category, event.eventId),
        this.saveLocation(queryRunner, countryId, stateId, cityId, event.eventId),
        this.saveGallery(queryRunner, photoGallery, event.eventId),
        this.saveQuestions(queryRunner, questionnaire, event.eventId),
        this.saveSpeakers(queryRunner, speakers, event.eventId),
        this.saveSearchTags(queryRunner, searchTags, event.eventId),
      ]);
      await queryRunner.commitTransaction();
      return event;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed to create event: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }


  async update(eventId: number, updateEventDto: UpdateEventDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const event = await this.eventRepository.findOne({ where: { eventId } });
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      const {
        searchTags,
        speakers,
        questionnaire,
        photoGallery,
        countryId,
        stateId,
        cityId,
        category,
        price,
        ...eventData
      } = updateEventDto;
      await this.eventRepository.update(eventId, eventData);
      await Promise.all([
        this.savePrices(queryRunner, price, eventId, true),
        this.saveCategories(queryRunner, category, eventId, true),
        this.saveLocation(queryRunner, countryId, stateId, cityId, eventId, true),
        this.saveGallery(queryRunner, photoGallery, eventId, true),
        this.saveQuestions(queryRunner, questionnaire, eventId, true),
        this.saveSpeakers(queryRunner, speakers, eventId, true),
        this.saveSearchTags(queryRunner, searchTags, eventId, true),
      ]);
      await queryRunner.commitTransaction();
      return event;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update event: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(eventId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const event = await queryRunner.manager.findOne(Event, { where: { eventId } });
      if (!event) throw new NotFoundException('Event not found');
  
      await queryRunner.manager.delete(EventPrice, { eventId });
      await queryRunner.manager.delete(EventsCategory, { eventId });
      await queryRunner.manager.delete(EventLocations, { eventId });
      await queryRunner.manager.delete(EventPhotoGallery, { eventId });
      await queryRunner.manager.delete(EventQuestion, { eventId });
      await queryRunner.manager.delete(EventSpeaker, { eventId });
      await queryRunner.manager.delete(EventTagRelationship, { eventId });
      await queryRunner.manager.delete(Event, { eventId });

      await queryRunner.commitTransaction();
      return { message: 'Event deleted' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Failed to delete event: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
  

  private async savePrices(qr: QueryRunner, price: any[], eventId: number , isEdit: boolean = false) {
    if (!price) return;
    if (isEdit) {
      await qr.manager.delete(EventPrice, { eventId });
    }
    for (const item of price) {
      await qr.manager.save(EventPrice, {
        eventId,
        price: item.price,
        currencyId: item.currencyId,
      });
    }
  }

  private async saveCategories(qr: QueryRunner, categories: number[], eventId: number , isEdit: boolean = false) {
    if (!categories?.length) return;
    if (isEdit) {
      await qr.manager.delete(EventsCategory, { eventId });
    }
    for (const categoryId of categories) {
      await qr.manager.save(EventsCategory, { eventId, categoryId });
    }
  }

  private async saveLocation(qr: QueryRunner, countryId: number, stateId: number, cityId: number, eventId: number , isEdit: boolean = false) {
    if (!(countryId && stateId && cityId)) return;
    if (isEdit) {
      await qr.manager.delete(EventLocations, { eventId });
    }
    await qr.manager.save(EventLocations, { eventId, countryId, stateId, cityId });
  }

  private async saveGallery(qr: QueryRunner, gallery: string[], eventId: number , isEdit: boolean = false) {
    if (!gallery?.length) return;
    if (isEdit) {
      await qr.manager.delete(EventPhotoGallery, { eventId });
    }
    for (const imagePath of gallery) {
      await qr.manager.save(EventPhotoGallery, { eventId, imagePath });
    }
  }

  private async saveQuestions(qr: QueryRunner, questions: any[], eventId: number , isEdit: boolean = false) {
    if (!questions?.length) return;
    if (isEdit) {
      await qr.manager.delete(EventQuestion, { eventId });
    }
    for (const { qKey, question } of questions) {
      await qr.manager.save(EventQuestion, { eventId, qKey, question });
    }
  }

  private async saveSpeakers(qr: QueryRunner, speakers: any[], eventId: number , isEdit: boolean = false) {
    if (!speakers?.length) return;
    if (isEdit) {
      await qr.manager.delete(EventSpeaker, { eventId });
    }
    for (const { name, designation, linkedinProfile, image } of speakers) {
      await qr.manager.save(EventSpeaker, {
        eventId,
        name,
        designation,
        linkedinProfile,
        image: image || "",
      });
    }
  }

  private async saveSearchTags(qr: QueryRunner, tags: any[], eventId: number , isEdit: boolean = false) {
    if (!tags?.length) return;
    if (isEdit) {
      await qr.manager.delete(EventTagRelationship, { eventId });
    }
    for (const { tagId } of tags) {
      await qr.manager.save(EventTagRelationship, { tagId, eventId });
    }
  }

  async previousEvents(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const events = await this.eventRepository.find({ 
        where: { 
          isActive: true,
          endDate: Raw((alias) => `${alias} < NOW()`),
        },
        skip,
        take: limit,
        order: {
          createdAt: 'DESC'
        }
      });
      return {
        events,
        pagination: {
          page,
          limit,
          total: events.length,
          totalPages: Math.ceil(events.length / limit)
        }
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch previous events: ${error.message}`);
    }
  }

  async searchEvents(page: number, limit: number, searchKeyword?: string) {
    try {
    const skip = (page - 1) * limit;
    const events = await this.eventRepository.find({ 
      where: { 
        isActive: true,
        ...(searchKeyword && { title: ILike(`%${searchKeyword}%`) })
      },
      skip,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    });
    if (!events?.length) {
      throw new NotFoundException('No events found');
    }
    return {
      events,
      pagination: {
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit)
      }
    };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to search events: ${error.message}`);
    }
  }

  async downloadEvent(page: number, limit: number, searchKeyword?: string) {
    try {
      const events = await this.eventRepository.find({
        select: ['eventId', 'title', 'timezoneId', 'startDate', 'endDate'],
        where: {
          isActive: true,
          ...(searchKeyword && { title: ILike(`%${searchKeyword}%`) })
        },
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC'
        }
      });

      return {
        events,
        pagination: {
          page,
          limit,
          total: events.length,
          totalPages: Math.ceil(events.length / limit)
        }
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to download events: ${error.message}`);
    }
  } 

  async upcomingEvents(page: number, limit: number) {
    try {
      const events = await this.eventRepository.find({
        where: {
          isActive: true,
          endDate: Raw((alias) => `NOW() <= ${alias}`)
        },
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC'
        }
      });   
      return {
        events,
        pagination: {
          page,
          limit,
          total: events.length,
          totalPages: Math.ceil(events.length / limit)
        }
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch upcoming events: ${error.message}`);
    }
  }

  async eventDetails(eventId: number) {
    try {
      const event = await this.eventRepository
      .createQueryBuilder('event')
      .select('event')
      .addSelect('GROUP_CONCAT(DISTINCT location.location)', 'locations')
      .leftJoin(EventLocations, 'eventLocation', 'eventLocation.eventId = event.eventId')
      .leftJoin('eventLocation.location', 'location')
      .where('event.eventId = :eventId', { eventId })
      .groupBy('event.eventId')
      .getOne();
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch event details: ${error.message}`);
    }
  }
}
