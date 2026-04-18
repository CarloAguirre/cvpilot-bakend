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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uploaded_file_entity_1 = require("./entities/uploaded-file.entity");
let FilesService = class FilesService {
    uploadedFilesRepository;
    constructor(uploadedFilesRepository) {
        this.uploadedFilesRepository = uploadedFilesRepository;
    }
    async listUserFiles(userId) {
        const files = await this.uploadedFilesRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        return files.map((file) => this.toFileResponse(file));
    }
    async createFileRecord(userId, createUploadedFileDto) {
        const file = this.uploadedFilesRepository.create({
            userId,
            originalName: createUploadedFileDto.originalName.trim(),
            storagePath: createUploadedFileDto.storagePath.trim(),
            mimeType: createUploadedFileDto.mimeType.trim(),
            fileExtension: createUploadedFileDto.fileExtension.trim().toLowerCase(),
            fileSizeBytes: String(createUploadedFileDto.fileSizeBytes),
            checksum: createUploadedFileDto.checksum?.trim() ?? null,
        });
        const savedFile = await this.uploadedFilesRepository.save(file);
        return this.toFileResponse(savedFile);
    }
    async storeUploadedFile(userId, createUploadedFileDto) {
        return this.createFileRecord(userId, createUploadedFileDto);
    }
    toFileResponse(file) {
        return {
            id: file.id,
            userId: file.userId,
            originalName: file.originalName,
            storagePath: file.storagePath,
            mimeType: file.mimeType,
            fileExtension: file.fileExtension,
            fileSizeBytes: Number(file.fileSizeBytes),
            checksum: file.checksum,
            createdAt: file.createdAt,
        };
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(uploaded_file_entity_1.UploadedFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FilesService);
//# sourceMappingURL=files.service.js.map