import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvVersion } from '../cvs/entities/cv-version.entity';
import { Cv } from '../cvs/entities/cv.entity';
import { UploadedFile } from '../files/entities/uploaded-file.entity';
import { CreateCvImprovementRequestDto } from './dto/create-cv-improvement-request.dto';
import { UpdateCvImprovementRequestDto } from './dto/update-cv-improvement-request.dto';
import { CvImprovementRequest } from './entities/cv-improvement-request.entity';

@Injectable()
export class ImprovementsService {
  constructor(
    @InjectRepository(CvImprovementRequest)
    readonly cvImprovementRequestsRepository: Repository<CvImprovementRequest>,
    @InjectRepository(UploadedFile)
    readonly uploadedFilesRepository: Repository<UploadedFile>,
    @InjectRepository(Cv)
    readonly cvsRepository: Repository<Cv>,
    @InjectRepository(CvVersion)
    readonly cvVersionsRepository: Repository<CvVersion>,
  ) {}

  async listRequests(userId: string) {
    const requests = await this.cvImprovementRequestsRepository.find({
      where: { userId },
      relations: {
        cv: true,
        uploadedFile: true,
        resultCvVersion: true,
      },
      order: { createdAt: 'DESC' },
    });

    return requests.map((request) => this.toRequestResponse(request));
  }

  async createRequest(
    userId: string,
    createCvImprovementRequestDto: CreateCvImprovementRequestDto,
  ) {
    const uploadedFile = await this.uploadedFilesRepository.findOne({
      where: { id: createCvImprovementRequestDto.uploadedFileId, userId },
    });

    if (!uploadedFile) {
      throw new BadRequestException('Uploaded file not found for this user');
    }

    let cv: Cv | null = null;
    if (createCvImprovementRequestDto.cvId) {
      cv = await this.cvsRepository.findOne({
        where: { id: createCvImprovementRequestDto.cvId, userId },
      });

      if (!cv) {
        throw new BadRequestException('CV not found for this user');
      }
    }

    const request = this.cvImprovementRequestsRepository.create({
      userId,
      cvId: cv?.id ?? null,
      uploadedFileId: uploadedFile.id,
      targetRole: createCvImprovementRequestDto.targetRole.trim(),
      jobDescription: createCvImprovementRequestDto.jobDescription?.trim() ?? null,
    });

    const savedRequest = await this.cvImprovementRequestsRepository.save(request);
    const hydratedRequest = await this.cvImprovementRequestsRepository.findOne({
      where: { id: savedRequest.id, userId },
      relations: {
        cv: true,
        uploadedFile: true,
        resultCvVersion: true,
      },
    });

    if (!hydratedRequest) {
      throw new NotFoundException('Improvement request not found');
    }

    return this.toRequestResponse(hydratedRequest);
  }

  async updateRequest(
    userId: string,
    requestId: string,
    updateCvImprovementRequestDto: UpdateCvImprovementRequestDto,
  ) {
    const request = await this.cvImprovementRequestsRepository.findOne({
      where: { id: requestId, userId },
    });

    if (!request) {
      throw new NotFoundException('Improvement request not found');
    }

    if (updateCvImprovementRequestDto.resultCvVersionId) {
      const resultVersion = await this.cvVersionsRepository
        .createQueryBuilder('cvVersion')
        .innerJoin('cvVersion.cv', 'cv')
        .where('cvVersion.id = :resultCvVersionId', {
          resultCvVersionId: updateCvImprovementRequestDto.resultCvVersionId,
        })
        .andWhere('cv.userId = :userId', { userId })
        .getOne();

      if (!resultVersion) {
        throw new BadRequestException(
          'Result CV version does not belong to this user',
        );
      }

      request.resultCvVersionId = resultVersion.id;
    }

    if (updateCvImprovementRequestDto.status !== undefined) {
      request.status = updateCvImprovementRequestDto.status;
    }

    if (updateCvImprovementRequestDto.errorMessage !== undefined) {
      request.errorMessage =
        updateCvImprovementRequestDto.errorMessage?.trim() ?? null;
    }

    const updatedRequest = await this.cvImprovementRequestsRepository.save(request);
    const hydratedRequest = await this.cvImprovementRequestsRepository.findOne({
      where: { id: updatedRequest.id, userId },
      relations: {
        cv: true,
        uploadedFile: true,
        resultCvVersion: true,
      },
    });

    if (!hydratedRequest) {
      throw new NotFoundException('Improvement request not found');
    }

    return this.toRequestResponse(hydratedRequest);
  }

  private toRequestResponse(request: CvImprovementRequest) {
    return {
      id: request.id,
      userId: request.userId,
      cvId: request.cvId,
      uploadedFileId: request.uploadedFileId,
      targetRole: request.targetRole,
      jobDescription: request.jobDescription,
      status: request.status,
      errorMessage: request.errorMessage,
      resultCvVersionId: request.resultCvVersionId,
      cv: request.cv
        ? {
            id: request.cv.id,
            title: request.cv.title,
            targetRole: request.cv.targetRole,
            currentVersionId: request.cv.currentVersionId,
            isArchived: request.cv.isArchived,
          }
        : null,
      uploadedFile: request.uploadedFile
        ? {
            id: request.uploadedFile.id,
            originalName: request.uploadedFile.originalName,
            mimeType: request.uploadedFile.mimeType,
            fileExtension: request.uploadedFile.fileExtension,
            fileSizeBytes: Number(request.uploadedFile.fileSizeBytes),
            storagePath: request.uploadedFile.storagePath,
            createdAt: request.uploadedFile.createdAt,
          }
        : null,
      resultCvVersion: request.resultCvVersion
        ? {
            id: request.resultCvVersion.id,
            versionNumber: request.resultCvVersion.versionNumber,
            versionType: request.resultCvVersion.versionType,
            targetRole: request.resultCvVersion.targetRole,
            isCurrent: request.resultCvVersion.isCurrent,
            createdAt: request.resultCvVersion.createdAt,
          }
        : null,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };
  }
}