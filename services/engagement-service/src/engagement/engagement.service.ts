import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Engagement } from './entities/engagement.entity';
import { CreateEngagementDto } from './dto/create-engagement.dto';

@Injectable()
export class EngagementService {
  constructor(
    @InjectRepository(Engagement)
    private engagementRepository: Repository<Engagement>,
  ) {}

  async create(createEngagementDto: CreateEngagementDto): Promise<Engagement> {
    const engagement = this.engagementRepository.create(createEngagementDto);
    return this.engagementRepository.save(engagement);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Engagement[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.engagementRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Engagement> {
    return this.engagementRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Engagement[]> {
    return this.engagementRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateEngagementDto: Partial<CreateEngagementDto>): Promise<Engagement> {
    await this.engagementRepository.update(id, updateEngagementDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<Engagement> {
    const engagement = await this.findOne(id);
    if (engagement) {
      await this.engagementRepository.delete(id);
    }
    return engagement;
  }

  async getEngagementScore(userId: string): Promise<number> {
    const result = await this.engagementRepository
      .createQueryBuilder('engagement')
      .select('SUM(engagement.value)', 'total')
      .where('engagement.userId = :userId', { userId })
      .getRawOne();
    
    return parseFloat(result?.total || '0');
  }
} 