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
exports.CvPersonalDetail = void 0;
const typeorm_1 = require("typeorm");
const timestamped_entity_1 = require("../../common/entities/timestamped.entity");
const cv_version_entity_1 = require("./cv-version.entity");
let CvPersonalDetail = class CvPersonalDetail extends timestamped_entity_1.CreatedUpdatedEntity {
    id;
    cvVersionId;
    fullName;
    email;
    phone;
    location;
    professionalSummary;
    cvVersion;
};
exports.CvPersonalDetail = CvPersonalDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], CvPersonalDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cv_version_id', type: 'bigint', unique: true }),
    __metadata("design:type", String)
], CvPersonalDetail.prototype, "cvVersionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], CvPersonalDetail.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], CvPersonalDetail.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], CvPersonalDetail.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], CvPersonalDetail.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'professional_summary',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", Object)
], CvPersonalDetail.prototype, "professionalSummary", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => cv_version_entity_1.CvVersion, (cvVersion) => cvVersion.personalDetail, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'cv_version_id' }),
    __metadata("design:type", cv_version_entity_1.CvVersion)
], CvPersonalDetail.prototype, "cvVersion", void 0);
exports.CvPersonalDetail = CvPersonalDetail = __decorate([
    (0, typeorm_1.Entity)({ name: 'cv_personal_details' }),
    (0, typeorm_1.Index)('idx_cv_personal_details_email', ['email'])
], CvPersonalDetail);
//# sourceMappingURL=cv-personal-detail.entity.js.map