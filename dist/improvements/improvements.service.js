"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImprovementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cv_version_entity_1 = require("../cvs/entities/cv-version.entity");
const cv_entity_1 = require("../cvs/entities/cv.entity");
const uploaded_file_entity_1 = require("../files/entities/uploaded-file.entity");
const cv_improvement_request_entity_1 = require("./entities/cv-improvement-request.entity");
let ImprovementsService = class ImprovementsService {
    cvImprovementRequestsRepository;
    uploadedFilesRepository;
    cvsRepository;
    cvVersionsRepository;
    constructor(cvImprovementRequestsRepository, uploadedFilesRepository, cvsRepository, cvVersionsRepository) {
        this.cvImprovementRequestsRepository = cvImprovementRequestsRepository;
        this.uploadedFilesRepository = uploadedFilesRepository;
        this.cvsRepository = cvsRepository;
        this.cvVersionsRepository = cvVersionsRepository;
    }
    async listRequests(userId) {
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
    async createRequest(userId, createCvImprovementRequestDto) {
        const uploadedFile = await this.uploadedFilesRepository.findOne({
            where: { id: createCvImprovementRequestDto.uploadedFileId, userId },
        });
        if (!uploadedFile) {
            throw new common_1.BadRequestException('Uploaded file not found for this user');
        }
        let cv = null;
        if (createCvImprovementRequestDto.cvId) {
            cv = await this.cvsRepository.findOne({
                where: { id: createCvImprovementRequestDto.cvId, userId },
            });
            if (!cv) {
                throw new common_1.BadRequestException('CV not found for this user');
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
            throw new common_1.NotFoundException('Improvement request not found');
        }
        return this.toRequestResponse(hydratedRequest);
    }
    async updateRequest(userId, requestId, updateCvImprovementRequestDto) {
        const request = await this.cvImprovementRequestsRepository.findOne({
            where: { id: requestId, userId },
        });
        if (!request) {
            throw new common_1.NotFoundException('Improvement request not found');
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
                throw new common_1.BadRequestException('Result CV version does not belong to this user');
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
            throw new common_1.NotFoundException('Improvement request not found');
        }
        return this.toRequestResponse(hydratedRequest);
    }
    toRequestResponse(request) {
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
};
exports.ImprovementsService = ImprovementsService;
exports.ImprovementsService = ImprovementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cv_improvement_request_entity_1.CvImprovementRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(uploaded_file_entity_1.UploadedFile)),
    __param(2, (0, typeorm_1.InjectRepository)(cv_entity_1.Cv)),
    __param(3, (0, typeorm_1.InjectRepository)(cv_version_entity_1.CvVersion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ImprovementsService);
//# sourceMappingURL=improvements.service.js.map