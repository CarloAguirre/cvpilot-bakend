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
exports.CvVersion = void 0;
const typeorm_1 = require("typeorm");
const timestamped_entity_1 = require("../../common/entities/timestamped.entity");
const database_enums_1 = require("../../common/enums/database.enums");
const system_event_entity_1 = require("../../events/entities/system-event.entity");
const cv_improvement_request_entity_1 = require("../../improvements/entities/cv-improvement-request.entity");
const cv_entity_1 = require("./cv.entity");
const cv_education_entry_entity_1 = require("./cv-education-entry.entity");
const cv_personal_detail_entity_1 = require("./cv-personal-detail.entity");
const cv_version_skill_entity_1 = require("./cv-version-skill.entity");
const cv_work_experience_entity_1 = require("./cv-work-experience.entity");
let CvVersion = class CvVersion extends timestamped_entity_1.CreatedUpdatedEntity {
    id;
    cvId;
    versionNumber;
    versionType;
    targetRole;
    jobDescription;
    summaryText;
    skillsText;
    stylePreset;
    generatedFileUrl;
    generatedFileFormat;
    isCurrent;
    createdByProcess;
    cv;
    personalDetail;
    workExperiences;
    educationEntries;
    versionSkills;
    improvementRequestResults;
    systemEvents;
};
exports.CvVersion = CvVersion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], CvVersion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cv_id', type: 'bigint' }),
    __metadata("design:type", String)
], CvVersion.prototype, "cvId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'version_number', type: 'integer' }),
    __metadata("design:type", Number)
], CvVersion.prototype, "versionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'version_type', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CvVersion.prototype, "versionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_role', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], CvVersion.prototype, "targetRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'job_description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CvVersion.prototype, "jobDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'summary_text', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CvVersion.prototype, "summaryText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'skills_text', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CvVersion.prototype, "skillsText", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'style_preset',
        type: 'varchar',
        length: 20,
        default: database_enums_1.CvStylePreset.ATS,
    }),
    __metadata("design:type", String)
], CvVersion.prototype, "stylePreset", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'generated_file_url', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CvVersion.prototype, "generatedFileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'generated_file_format',
        type: 'varchar',
        length: 10,
        nullable: true,
    }),
    __metadata("design:type", Object)
], CvVersion.prototype, "generatedFileFormat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_current', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CvVersion.prototype, "isCurrent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_by_process',
        type: 'varchar',
        length: 20,
        default: database_enums_1.CreatedByProcess.MANUAL,
    }),
    __metadata("design:type", String)
], CvVersion.prototype, "createdByProcess", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cv_entity_1.Cv, (cv) => cv.versions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'cv_id' }),
    __metadata("design:type", cv_entity_1.Cv)
], CvVersion.prototype, "cv", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => cv_personal_detail_entity_1.CvPersonalDetail, (cvPersonalDetail) => cvPersonalDetail.cvVersion),
    __metadata("design:type", cv_personal_detail_entity_1.CvPersonalDetail)
], CvVersion.prototype, "personalDetail", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cv_work_experience_entity_1.CvWorkExperience, (cvWorkExperience) => cvWorkExperience.cvVersion),
    __metadata("design:type", Array)
], CvVersion.prototype, "workExperiences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cv_education_entry_entity_1.CvEducationEntry, (cvEducationEntry) => cvEducationEntry.cvVersion),
    __metadata("design:type", Array)
], CvVersion.prototype, "educationEntries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cv_version_skill_entity_1.CvVersionSkill, (cvVersionSkill) => cvVersionSkill.cvVersion),
    __metadata("design:type", Array)
], CvVersion.prototype, "versionSkills", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cv_improvement_request_entity_1.CvImprovementRequest, (cvImprovementRequest) => cvImprovementRequest.resultCvVersion),
    __metadata("design:type", Array)
], CvVersion.prototype, "improvementRequestResults", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => system_event_entity_1.SystemEvent, (systemEvent) => systemEvent.cvVersion),
    __metadata("design:type", Array)
], CvVersion.prototype, "systemEvents", void 0);
exports.CvVersion = CvVersion = __decorate([
    (0, typeorm_1.Entity)({ name: 'cv_versions' }),
    (0, typeorm_1.Unique)('uq_cv_versions_cv_version_number', ['cvId', 'versionNumber']),
    (0, typeorm_1.Index)('idx_cv_versions_cv_id', ['cvId']),
    (0, typeorm_1.Index)('idx_cv_versions_target_role', ['targetRole']),
    (0, typeorm_1.Index)('idx_cv_versions_created_at', ['createdAt']),
    (0, typeorm_1.Index)('idx_cv_versions_is_current', ['cvId', 'isCurrent']),
    (0, typeorm_1.Index)('uq_cv_versions_one_current_per_cv', ['cvId'], {
        unique: true,
        where: '"is_current" = true',
    })
], CvVersion);
//# sourceMappingURL=cv-version.entity.js.map