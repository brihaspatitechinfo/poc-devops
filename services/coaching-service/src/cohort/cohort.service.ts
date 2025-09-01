import { Injectable, NotFoundException, BadRequestException, ConflictException, HttpStatus, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, DataSource } from 'typeorm';
import { WitSelectCohort } from './entities/wit-select-cohort.entity';
import { Interaction } from './entities/wit-select-cohort-interactions.entity';
import { CohortFeedbackFrequency } from './entities/cohort-feedback-frequency.entity';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import * as XLSX from 'xlsx';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ValidateCohortExcelDto } from './dto/validate-cohort-excel.dto';
import { HttpService } from '@nestjs/axios';
import { MenteeEnrollmentTable } from './entities/mentee-enrollment.entity';
import { AxiosResponse } from 'axios';
import { Console, error } from 'console';
import { MentoringType, CohortStatus, CreationStatus, CohortType, AssignCoachType, SearchOption } from './enums/cohort.enums';

@Injectable()
export class CohortService {
  private readonly logger = new Logger(CohortService.name);
  constructor(
    @InjectRepository(WitSelectCohort)
    private readonly cohortRepository: Repository<WitSelectCohort>,
    @InjectRepository(Interaction)
    private readonly interactionRepository: Repository<Interaction>,
    @InjectRepository(CohortFeedbackFrequency)
    private readonly feedbackFrequencyRepository: Repository<CohortFeedbackFrequency>,
    @InjectRepository(MenteeEnrollmentTable)
    private readonly menteeEnrollmentRepository: Repository<MenteeEnrollmentTable>,
    private readonly httpService: HttpService, // <-- inject HttpService
    private readonly dataSource: DataSource, // <-- inject DataSource for transactions
  ) { }

  private generateCohortName(corporateName: string, allowedMentees: number): string {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = currentDate.getFullYear();

    return `${corporateName}|${day} ${month} ${year}|${allowedMentees}`;
  }



  private calculateSessionBasedFeedbackFrequency(feedbackFrequency: number, totalSessions: number): string[] {
    if (feedbackFrequency > totalSessions) {
      throw new BadRequestException(`Feedback frequency (${feedbackFrequency}) cannot exceed total sessions (${totalSessions})`);
    }
    if (feedbackFrequency <= 0) {
      throw new BadRequestException('Feedback frequency must be a positive number');
    }

    // Calculate which sessions should have feedback
    // For example: if totalSessions=6 and feedbackFrequency=3, we want sessions [1, 3, 5]
    // If feedbackFrequency=6, we want sessions [1, 2, 3, 4, 5, 6]
    const sessionNumbers: string[] = [];

    if (feedbackFrequency === totalSessions) {
      // Feedback after every session
      for (let i = 1; i <= totalSessions; i++) {
        sessionNumbers.push(i.toString());
      }
    } else {
      // Distribute feedback sessions evenly
      const step = totalSessions / feedbackFrequency;
      for (let i = 0; i < feedbackFrequency; i++) {
        const sessionNumber = Math.floor(i * step) + 1;
        sessionNumbers.push(sessionNumber.toString());
      }
    }

    return sessionNumbers;
  }

  private validateFeedbackFrequency(feedbackFrequency: number, totalSessions: number): void {
    if (feedbackFrequency > totalSessions) {
      throw new BadRequestException(`Feedback frequency (${feedbackFrequency}) cannot exceed total sessions (${totalSessions})`);
    }

    if (feedbackFrequency <= 0) {
      throw new BadRequestException('Feedback frequency must be a positive number');
    }
  }

  private validateMetadata(metadata: string[], totalSessions: number): void {
    if (!metadata || metadata.length === 0) {
      throw new BadRequestException('Metadata (feedback session numbers) is required');
    }
    // Check for valid numbers (as strings)
    if (metadata.some(num => isNaN(Number(num)) || Number(num) < 1 || Number(num) > totalSessions)) {
      throw new BadRequestException('All feedback session numbers must be between 1 and total number of sessions');
    }
    const uniqueNumbers = new Set(metadata);
    if (uniqueNumbers.size !== metadata.length) {
      throw new BadRequestException('Feedback session numbers must be unique');
    }
  }


  private calculateSessionDates(cohortStartDate: Date, cohortEndDate: Date, numberOfSessions: number): Array<{ startDate: Date; endDate: Date }> {
    const sessionDates = [];
    const totalDurationMs = cohortEndDate.getTime() - cohortStartDate.getTime();
    const sessionDurationMs = totalDurationMs / numberOfSessions;

    for (let i = 0; i < numberOfSessions; i++) {
      const sessionStartDate = new Date(cohortStartDate.getTime() + (i * sessionDurationMs));
      const sessionEndDate = new Date(cohortStartDate.getTime() + ((i + 1) * sessionDurationMs));

      sessionDates.push({
        startDate: sessionStartDate,
        endDate: sessionEndDate
      });
    }

    return sessionDates;
  }

  async create(createCohortDto: CreateCohortDto): Promise<WitSelectCohort> {
    try {
      // All validation logic remains the same up to DB writes
      // Auto-generate name if not provided
      if (!createCohortDto.name) {
        if (!createCohortDto.corporateName) {
          throw new BadRequestException('Corporate name is required when not auto-generating cohort name');
        }
        createCohortDto.name = this.generateCohortName(createCohortDto.corporateName, createCohortDto.allowedMentees);
      }

      // Check for unique cohort name
      const existingCohort = await this.cohortRepository.findOne({ where: { name: createCohortDto.name } });
      if (existingCohort) {
        throw new ConflictException('A cohort with this name already exists. Please use a different name.');
      }

      // Validate dates
      const startDate = new Date(createCohortDto.startDate);
      const endDate = new Date(createCohortDto.endDate);
      if (startDate >= endDate) {
        throw new BadRequestException('End date must be after start date');
      }

      // Validate mentoring type and group size logic
      if (createCohortDto.mentoringType === MentoringType.ONE_TO_ONE) {
        if (createCohortDto.groupSize !== undefined) {
          throw new BadRequestException('Group size is not applicable for one-to-one mentoring');
        }
      } else if (createCohortDto.mentoringType === MentoringType.GROUP) {
        // For group mentoring, groupSize is required and must be at least 2
        if (!createCohortDto.groupSize) {
          throw new BadRequestException('Group size is required for group mentoring');
        }
        if (createCohortDto.groupSize < 2) {
          throw new BadRequestException('Group size must be at least 2 for group mentoring');
        }
        // Group size cannot exceed allowed mentees
        if (createCohortDto.groupSize > createCohortDto.allowedMentees) {
          throw new BadRequestException('Group size cannot exceed the number of allowed mentees');
        }

        // For group mentoring, automatically set searchOption to Offline Matches (0)
        createCohortDto.searchOption = SearchOption.OFFLINE_MATCHES;
      }
      if (createCohortDto.sessionDurations !== undefined && !Array.isArray(createCohortDto.sessionDurations)) {
        throw new BadRequestException('sessionDurations must be an array');
      }
      // Convert sessionDurations to array of strings if provided
      if (createCohortDto.sessionDurations !== undefined) {
        createCohortDto.sessionDurations = createCohortDto.sessionDurations.map(String);
      }
      // Validate price range
      if (createCohortDto.minPrice > createCohortDto.maxPrice) {
        throw new BadRequestException('Min price cannot be greater than max price');
      }

      // Handle isFfMandatory logic - automatically add last interaction to metadata if not present
      if (createCohortDto.isFfMandatory === 1) {
        if (!createCohortDto.metadata) {
          createCohortDto.metadata = [];
        }

        // Ensure metadata is an array
        if (!Array.isArray(createCohortDto.metadata)) {
          createCohortDto.metadata = [createCohortDto.metadata];
        }

        // Add the last interaction if not already present
        const lastInteractionStr = String(createCohortDto.noOfInteractions);
        if (!createCohortDto.metadata.includes(lastInteractionStr)) {
          createCohortDto.metadata.push(lastInteractionStr);
        }
      }

      // Calculate duration in days from start date to end date
      const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      return await this.dataSource.transaction(async manager => {
        const cohort = manager.create(WitSelectCohort, {
          ...createCohortDto,
          startDate: startDate,
          endDate: endDate,
          duration: durationInDays,
          sessionDurations: createCohortDto.sessionDurations ? createCohortDto.sessionDurations.map(String) : undefined
        });
        const savedCohort = await manager.save(WitSelectCohort, cohort);

        // Create feedback frequency if specified
        if (createCohortDto.metadata) {
          this.validateMetadata(createCohortDto.metadata, createCohortDto.noOfInteractions);
          const feedbackFrequency = createCohortDto.metadata.length;
          const feedbackFrequencyEntity = manager.create(CohortFeedbackFrequency, {
            cohortId: savedCohort.id,
            frequency: feedbackFrequency,
            metadata: createCohortDto.metadata,
          });
          await manager.save(CohortFeedbackFrequency, feedbackFrequencyEntity);
        }

        // Generate sessions for the cohort
        const sessionDates = this.calculateSessionDates(startDate, endDate, createCohortDto.noOfInteractions ?? 1);
        for (let i = 0; i < sessionDates.length; i++) {
          const session = manager.create(Interaction, {
            cohortId: savedCohort.id,
            userId: createCohortDto.createdBy ?? 0,
            title: `Interaction ${i + 1}`,
            startDate: sessionDates[i].startDate,
            endDate: sessionDates[i].endDate,
            status: 1,
          });
          await manager.save(Interaction, session);
        }

        // Chemistry session logic for one-to-one, Automatic through Algorithm, and active chemistry session status
        if (
          createCohortDto.mentoringType === MentoringType.ONE_TO_ONE &&
          createCohortDto.searchOption === SearchOption.AUTOMATIC_THROUGH_ALGORITHM &&
          createCohortDto.chemistrySessionStatus === 1 &&
          createCohortDto.chemistrySessionCount > 0
        ) {
          for (let i = 0; i < createCohortDto.chemistrySessionCount; i++) {
            const chemistrySession = manager.create(Interaction, {
              cohortId: savedCohort.id,
              userId: createCohortDto.createdBy,
              title: `chemistry_session_${i + 1}`,
              startDate: startDate, // or set to null/placeholder if needed
              endDate: endDate,     // or set to null/placeholder if needed
              status: 1, // confirmed
            });
            await manager.save(Interaction, chemistrySession);
          }
        }
        return savedCohort;
      });
    } catch (error) {
      this.logger.error(`Error in create cohort: ${error.message}`, error.stack);
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create cohort: ' + error.message);
    }
  }

  async findAll(query: any) {
    try {
      const { page = 1, limit = 10, search, status, cohortType, mentoringType, isInternal, organizationId, createdBy, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
      const whereConditions: FindOptionsWhere<WitSelectCohort> = {};
      if (search) {
        whereConditions.name = Like(`%${search}%`);
      }

      if (status !== undefined) {
        whereConditions.status = status;
      }

      if (cohortType !== undefined) {
        whereConditions.cohortType = cohortType;
      }

      if (mentoringType !== undefined) {
        whereConditions.mentoringType = mentoringType;
      }

      if (isInternal !== undefined) {
        whereConditions.isInternal = isInternal;
      }

      if (organizationId !== undefined) {
        whereConditions.organizationId = organizationId;
      }

      if (createdBy !== undefined) {
        whereConditions.createdBy = createdBy;
      }

      const [cohort, total] = await this.cohortRepository.findAndCount({
        where: whereConditions,
        order: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['interactions', 'feedbackFrequencies'],
      });

      return {
        data: cohort,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Error in findAll cohorts: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch cohorts: ' + error.message);
    }
  }

  async findOne(id: number): Promise<WitSelectCohort> {
    try {
      const cohort = await this.cohortRepository.findOne({
        where: { id },
        relations: ['interactions', 'feedbackFrequencies'],
      });
      if (!cohort) {
        throw new NotFoundException(`Cohort with ID ${id} not found`);
      }
      // Add feedback session numbers to each frequency
      if (cohort?.feedbackFrequencies?.length > 0) {
        cohort.feedbackFrequencies.forEach(frequency => {
          (frequency as any).feedbackSessionNumbers = frequency?.metadata ?? [];
        });
      }

      return cohort;
    } catch (error) {
      this.logger.error(`Error in findOne cohort: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch cohort: ' + error.message);
    }
  }

  async update(id: number, updateCohortDto: UpdateCohortDto): Promise<{ message: string }> {
    try {
      await this.dataSource.transaction(async manager => {
        if (Object.keys(updateCohortDto).length === 0) {
          throw new BadRequestException('No valid fields provided for update. The request body should not be empty.');
        }

        const existingCohort = await manager.findOne(WitSelectCohort, { where: { id } });
        if (!existingCohort) {
          throw new NotFoundException(`Cohort with ID ${id} not found`);
        }

        if (updateCohortDto.sessionDurations) {
          if (!Array.isArray(updateCohortDto.sessionDurations)) {
            throw new BadRequestException('sessionDurations must be an array');
          }
          updateCohortDto.sessionDurations = updateCohortDto.sessionDurations.map(String);
        }

        const updatePayload = Object.fromEntries(
          Object.entries(updateCohortDto).filter(([_, v]) => v !== undefined)
        );

        await manager.update(WitSelectCohort, id, {
          ...updatePayload,
          sessionDurations: updatePayload.sessionDurations?.map(String) ?? undefined,
        });

        // Merged logic from updateFeedbackFrequencyMetadata
        const noOfInteractions = updateCohortDto.noOfInteractions ?? existingCohort.noOfInteractions;
        if (updateCohortDto.isFfMandatory !== undefined && noOfInteractions !== undefined) {
          const lastInteractionStr = String(noOfInteractions);
          const feedbackFrequencies = await manager.find(CohortFeedbackFrequency, { where: { cohortId: id } });

          for (const freq of feedbackFrequencies) {
            if (!Array.isArray(freq?.metadata)) continue;

            const hasLastInteraction = freq.metadata.includes(lastInteractionStr);

            if (updateCohortDto.isFfMandatory === 1 && !hasLastInteraction) {
              freq.metadata.push(lastInteractionStr);
              await manager.save(CohortFeedbackFrequency, freq);
            } else if (updateCohortDto.isFfMandatory === 0 && hasLastInteraction) {
              freq.metadata = freq.metadata.filter(m => m !== lastInteractionStr);
              await manager.save(CohortFeedbackFrequency, freq);
            }
          }
        }
      });

      return { message: 'Cohort updated successfully' };
    } catch (error) {
      this.logger.error(`Error in update cohort: ${error.message}`, error.stack);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update cohort: ' + error.message);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.dataSource.transaction(async manager => {
        const cohort = await manager.findOne(WitSelectCohort, { where: { id } });
        if (!cohort) {
          throw new NotFoundException(`Cohort with ID ${id} not found`);
        }

        const interactionCount = await manager.count(Interaction, { where: { cohortId: id } });
        if (interactionCount > 0) {
          throw new BadRequestException('Cannot delete cohort with existing interactions');
        }

        await manager.delete(CohortFeedbackFrequency, { cohortId: id });
        await manager.delete(WitSelectCohort, id);
      });
    } catch (error) {
      this.logger.error(`Error removing cohort: ${error.message}`, error.stack);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete cohort: ${error.message}`);
    }
  }
  

  validateCohortExcelRows(rows: any[]): {
    total: number;
    valid: number;
    invalid: number;
    invalidRows: { row: number; errors: string[] }[];
    validRows: { row: number; data: any }[];
  } {

    const validRows = [];
    const invalidRows = [];

    rows.forEach((row, idx) => {
      const dtoObj = {
        ['First Name*']: row['First Name*'],
        ['Last Name*']: row['Last Name*'],
        ['Email*']: row['Email*'],
        ['Country Dial Code*']: row['Country Dial Code*'],
        ['Phone No*']: row['Phone No*'],
        ['Gender*']: row['Gender*'],
        ['Total Years of Experience*']: row['Total Years of Experience*'],
        ['Country*']: row['Country*'],
        ['Level*']: row['Level*'],
        industryType: row['Industry Type'],
        functionalArea: row['Functional Area'],
        currentRoleOrDesignation: row['Current Role/Designation'],
        businessAndTechSkills: row['Business & Tech Skills'],
        softSkills: row['Soft Skills'],
        linkedInLink: row['LinkedIn Link'],
      };

      const dtoInstance = plainToInstance(ValidateCohortExcelDto, dtoObj);
      const errors = validateSync(dtoInstance, { whitelist: true });
      if (errors.length === 0) {
        validRows.push({ row: idx + 2, data: dtoObj });
      } else {
        invalidRows.push({
          row: idx + 2,
          errors: errors.flatMap(e => Object.values(e.constraints || {})),
        });
      }
    });

    return {
      total: rows.length,
      valid: validRows.length,
      invalid: invalidRows.length,
      invalidRows,
      validRows,
    };
  }


  async uploadCohortExcelAndRegisterMentees(
    rows: any,
    cohortId: string
  ) {
    try {
      const validation = this.validateCohortExcelRows(rows);
      const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3002/api/v1/users/multi-register';
      const defaultRole = 'coachee';
      if (!validation.validRows.length) {
        throw new BadRequestException('No valid mentee data found in the uploaded file.');
      }
      // Fetch cohort to check chemistrySessionCount
      const cohort = await this.cohortRepository.findOne({ where: { id: Number(cohortId) } });
      if (!cohort) {
        throw new BadRequestException('Invalid cohort ID: cohort does not exist');
      }
      const hasChemistrySession = cohort && cohort.chemistrySessionCount > 0;
      const optForChemistrySession = hasChemistrySession ? 1 : 0;

      const userDtos = validation.validRows.map(validRow => {
        const mentee = validRow.data;
        return {
          firstName: mentee['First Name*'],
          lastName: mentee['Last Name*'],
          email: mentee['Email*'],
          phone: mentee['Phone No*'],
          role: defaultRole,
          gender: mentee['Gender*'],
          experience: mentee['Total Years of Experience*'],
          country: mentee['Country*'],
          level: mentee['Level*'],
          password: 'Default@123',
        };
      });

      // Register users via User Service
      let savedUsers = [];
      let existingUsers = [];
      let response: AxiosResponse<any>;
      try {
        response = await this.httpService.axiosRef.post(userServiceUrl, userDtos);
      } catch (err) {
        // If the user service returns a non-2xx response, throw a BadRequestException
        const errorMsg = err?.response?.data?.message || err.message || 'User service error';
        throw new BadRequestException(`User service error: ${errorMsg}`);
      }
      const result = response.data;
      savedUsers = result.savedUsers || [];
      existingUsers = result.existingUsers || [];

      // Check for missing user IDs
      const allMentees = [...savedUsers, ...existingUsers];
      const usersMissingId = allMentees.filter(user => !user.id && !user._id);
      if (usersMissingId.length > 0) {
        this.logger.warn(`Some users returned from user service are missing id/_id: ${JSON.stringify(usersMissingId)}`);
        throw new InternalServerErrorException('User registration returned users without IDs');
      }
      const newlyEnrolled = [];
      const alreadyEnrolled = [];
      for (const user of allMentees) {
        const menteeId = user.id || user._id;
        if (!menteeId) continue;
        const existing = await this.menteeEnrollmentRepository.findOne({
          where: { cohort_id: Number(cohortId), mentee_id: menteeId }
        });
        if (existing) {
          alreadyEnrolled.push(user);
        } else {
          newlyEnrolled.push(user);
        }
      }

      // Save new enrollments
      if (newlyEnrolled.length) {
        const enrollmentEntities = newlyEnrolled.map(user => {
          const menteeId = user.id || user._id;
          return this.menteeEnrollmentRepository.create({
            cohort_id: Number(cohortId),
            mentee_id: menteeId,
            status: 1,
            opt_for_chemistry_session: optForChemistrySession,
            enrollment_at: new Date(),
            group: null,
            coaching_cancelled_at: null,
            assign_by: null,
          });
        });
        await this.menteeEnrollmentRepository.save(enrollmentEntities);
      }

      // Build response message
      if (newlyEnrolled.length && alreadyEnrolled.length) {
        return {
          message: 'Some mentees were newly enrolled, some were already present in this cohort.',
          savedUsers: newlyEnrolled,
          existingUsers: alreadyEnrolled,
          totalRows: validation.total,
        };
      } else if (newlyEnrolled.length) {
        return {
          message: 'All mentees were registered and enrolled successfully.',
          savedUsers: newlyEnrolled,
          existingUsers: [],
          totalRows: validation.total,
        };
      } else if (alreadyEnrolled.length) {
        throw new ConflictException('All mentees are already present in this cohort.');
      } else {
        throw new BadRequestException('No mentees processed.');
      }

    } catch (err) {
      this.logger.error(`Error uploading cohort Excel: ${err.message}`, err.stack);
      if(error instanceof ConflictException){
        throw error
      }
      if(error instanceof BadRequestException){
        throw error
      }
      throw new InternalServerErrorException('Failed to process cohort Excel. Please try again later. ' + err.message);
    }
  }
}  