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
exports.CvImprovementRequest = void 0;
const typeorm_1 = require("typeorm");
const timestamped_entity_1 = require("../../common/entities/timestamped.entity");
const database_enums_1 = require("../../common/enums/database.enums");
const cv_version_entity_1 = require("../../cvs/entities/cv-version.entity");
const cv_entity_1 = require("../../cvs/entities/cv.entity");
const uploaded_file_entity_1 = require("../../files/entities/uploaded-file.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let CvImprovementRequest = class CvImprovementRequest extends timestamped_entity_1.CreatedUpdatedEntity {
    id;
    userId;
    cvId;
    uploadedFileId;
    targetRole;
    jobDescription;
    status;
    errorMessage;
    resultCvVersionId;
    user;
    cv;
    uploadedFile;
    resultCvVersion;
};
exports.CvImprovementRequest = CvImprovementRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], CvImprovementRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", String)
], CvImprovementRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cv_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], CvImprovementRequest.prototype, "cvId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uploaded_file_id', type: 'bigint' }),
    __metadata("design:type", String)
], CvImprovementRequest.prototype, "uploadedFileId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_role', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], CvImprovementRequest.prototype, "targetRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'job_description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CvImprovementRequest.prototype, "jobDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'varchar',
        length: 20,
        default: database_enums_1.CvImprovementRequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], CvImprovementRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CvImprovementRequest.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'result_cv_version_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], CvImprovementRequest.prototype, "resultCvVersionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.cvImprovementRequests, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], CvImprovementRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cv_entity_1.Cv, (cv) => cv.improvementRequests, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'cv_id' }),
    __metadata("design:type", Object)
], CvImprovementRequest.prototype, "cv", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => uploaded_file_entity_1.UploadedFile, (uploadedFile) => uploadedFile.cvImprovementRequests, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'uploaded_file_id' }),
    __metadata("design:type", uploaded_file_entity_1.UploadedFile)
], CvImprovementRequest.prototype, "uploadedFile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cv_version_entity_1.CvVersion, (cvVersion) => cvVersion.improvementRequestResults, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'result_cv_version_id' }),
    __metadata("design:type", Object)
], CvImprovementRequest.prototype, "resultCvVersion", void 0);
exports.CvImprovementRequest = CvImprovementRequest = __decorate([
    (0, typeorm_1.Entity)({ name: 'cv_improvement_requests' }),
    (0, typeorm_1.Index)('idx_cv_improvement_requests_user_id', ['userId']),
    (0, typeorm_1.Index)('idx_cv_improvement_requests_cv_id', ['cvId']),
    (0, typeorm_1.Index)('idx_cv_improvement_requests_status', ['status']),
    (0, typeorm_1.Index)('idx_cv_improvement_requests_created_at', ['createdAt'])
], CvImprovementRequest);
//# sourceMappingURL=cv-improvement-request.entity.js.map