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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadedFile = void 0;
const typeorm_1 = require("typeorm");
const timestamped_entity_1 = require("../../common/entities/timestamped.entity");
const cv_improvement_request_entity_1 = require("../../improvements/entities/cv-improvement-request.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let UploadedFile = class UploadedFile extends timestamped_entity_1.CreatedAtEntity {
    id;
    userId;
    originalName;
    storagePath;
    mimeType;
    fileExtension;
    fileSizeBytes;
    checksum;
    user;
    cvImprovementRequests;
};
exports.UploadedFile = UploadedFile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], UploadedFile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", String)
], UploadedFile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], UploadedFile.prototype, "originalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'storage_path', type: 'text' }),
    __metadata("design:type", String)
], UploadedFile.prototype, "storagePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mime_type', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], UploadedFile.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_extension', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], UploadedFile.prototype, "fileExtension", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size_bytes', type: 'bigint' }),
    __metadata("design:type", String)
], UploadedFile.prototype, "fileSizeBytes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checksum', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], UploadedFile.prototype, "checksum", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.uploadedFiles, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UploadedFile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cv_improvement_request_entity_1.CvImprovementRequest, (cvImprovementRequest) => cvImprovementRequest.uploadedFile),
    __metadata("design:type", Array)
], UploadedFile.prototype, "cvImprovementRequests", void 0);
exports.UploadedFile = UploadedFile = __decorate([
    (0, typeorm_1.Entity)({ name: 'uploaded_files' }),
    (0, typeorm_1.Index)('idx_uploaded_files_user_id', ['userId']),
    (0, typeorm_1.Index)('idx_uploaded_files_created_at', ['createdAt'])
], UploadedFile);
//# sourceMappingURL=uploaded-file.entity.js.map