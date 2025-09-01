import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from './entities/assessment.entity';
import { Question } from './entities/question.entity';
import { Submission } from './entities/submission.entity';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [assessments, total] = await this.assessmentRepository.findAndCount({
      skip,
      take: limit,
      relations: ['questions'],
      order: { createdAt: 'DESC' },
    });

    return {
      assessments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }
    return assessment;
  }

  async create(createAssessmentDto: CreateAssessmentDto) {
    const assessment = this.assessmentRepository.create({
      title: createAssessmentDto.title,
      description: createAssessmentDto.description,
      createdBy: createAssessmentDto.createdBy,
      category: createAssessmentDto.category,
      difficulty: createAssessmentDto.difficulty,
      duration: createAssessmentDto.duration,
      passingScore: createAssessmentDto.passingScore,
    });

    const savedAssessment = await this.assessmentRepository.save(assessment);

    if (createAssessmentDto.questions && createAssessmentDto.questions.length > 0) {
      const questions = createAssessmentDto.questions.map((q, index) => 
        this.questionRepository.create({
          ...q,
          assessmentId: savedAssessment.id,
          order: index + 1,
        })
      );
      await this.questionRepository.save(questions);
    }

    return this.findOne(savedAssessment.id);
  }

  async update(id: string, updateAssessmentDto: UpdateAssessmentDto) {
    const assessment = await this.findOne(id);
    Object.assign(assessment, updateAssessmentDto);
    return this.assessmentRepository.save(assessment);
  }

  async remove(id: string) {
    const assessment = await this.findOne(id);
    await this.assessmentRepository.remove(assessment);
    return { message: 'Assessment deleted successfully' };
  }

  async submitAssessment(assessmentId: string, submitDto: SubmitAssessmentDto) {
    const assessment = await this.findOne(assessmentId);
    
    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const question of assessment.questions) {
      totalPoints += question.points;
      const userAnswer = submitDto.answers[question.id];
      if (userAnswer === question.correctAnswer) {
        earnedPoints += question.points;
      }
    }

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = percentage >= assessment.passingScore;

    const submission = this.submissionRepository.create({
      assessmentId,
      userId: submitDto.userId,
      answers: submitDto.answers,
      score: earnedPoints,
      percentage,
      passed,
      completedAt: new Date(),
    });

    return this.submissionRepository.save(submission);
  }

  async getSubmissions(assessmentId: string) {
    return this.submissionRepository.find({
      where: { assessmentId },
      order: { submittedAt: 'DESC' },
    });
  }

  async getUserResults(userId: string) {
    return this.submissionRepository.find({
      where: { userId },
      relations: ['assessment'],
      order: { submittedAt: 'DESC' },
    });
  }
} 