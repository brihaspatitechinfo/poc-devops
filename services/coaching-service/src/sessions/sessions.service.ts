import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, SessionStatus } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [sessions, total] = await this.sessionRepository.findAndCount({
      skip,
      take: limit,
      order: { scheduledAt: 'DESC' },
    });

    return {
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async create(createSessionDto: CreateSessionDto) {
    const session = this.sessionRepository.create({
      ...createSessionDto,
      scheduledAt: new Date(createSessionDto.scheduledAt),
    });
    return this.sessionRepository.save(session);
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    const session = await this.findOne(id);
    Object.assign(session, updateSessionDto);
    if (updateSessionDto.scheduledAt) {
      session.scheduledAt = new Date(updateSessionDto.scheduledAt);
    }
    return this.sessionRepository.save(session);
  }

  async remove(id: string) {
    const session = await this.findOne(id);
    session.status = SessionStatus.CANCELLED;
    await this.sessionRepository.save(session);
    return { message: 'Session cancelled successfully' };
  }

  async findByCoach(coachId: string) {
    return this.sessionRepository.find({
      where: { coachId },
      order: { scheduledAt: 'DESC' },
    });
  }

  async findByCoachee(coacheeId: string) {
    return this.sessionRepository.find({
      where: { coacheeId },
      order: { scheduledAt: 'DESC' },
    });
  }
}
