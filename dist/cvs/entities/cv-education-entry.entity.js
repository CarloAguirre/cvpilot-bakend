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
exports.CvEducationEntry = void 0;
const typeorm_1 = require("typeorm");
const timestamped_entity_1 = require("../../common/entities/timestamped.entity");
const cv_version_entity_1 = require("./cv-version.entity");
let CvEducationEntry = class CvEducationEntry extends timestamped_entity_1.CreatedUpdatedEntity {
    id;
    cvVersionId;
    institutionName;
    degreeTitle;
    periodLabel;
    startDate;
    endDate;
    displayOrder;
    cvVersion;
};
exports.CvEducationEntry = CvEducationEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], CvEducationEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cv_version_id', type: 'bigint' }),
    __metadata("design:type", String)
], CvEducationEntry.prototype, "cvVersionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'institution_name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], CvEducationEntry.prototype, "institutionName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'degree_title', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], CvEducationEntry.prototype, "degreeTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_label', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CvEducationEntry.prototype, "periodLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], CvEducationEntry.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], CvEducationEntry.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], CvEducationEntry.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cv_version_entity_1.CvVersion, (cvVersion) => cvVersion.educationEntries, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'cv_version_id' }),
    __metadata("design:type", cv_version_entity_1.CvVersion)
], CvEducationEntry.prototype, "cvVersion", void 0);
exports.CvEducationEntry = CvEducationEntry = __decorate([
    (0, typeorm_1.Entity)({ name: 'cv_education_entries' }),
    (0, typeorm_1.Index)('idx_cv_education_entries_cv_version_id', ['cvVersionId'])
], CvEducationEntry);
//# sourceMappingURL=cv-education-entry.entity.js.map