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
exports.CvVersionSkill = void 0;
const typeorm_1 = require("typeorm");
const cv_version_entity_1 = require("./cv-version.entity");
const skill_entity_1 = require("./skill.entity");
let CvVersionSkill = class CvVersionSkill {
    id;
    cvVersionId;
    skillId;
    displayOrder;
    cvVersion;
    skill;
};
exports.CvVersionSkill = CvVersionSkill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], CvVersionSkill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cv_version_id', type: 'bigint' }),
    __metadata("design:type", String)
], CvVersionSkill.prototype, "cvVersionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'skill_id', type: 'bigint' }),
    __metadata("design:type", String)
], CvVersionSkill.prototype, "skillId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], CvVersionSkill.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cv_version_entity_1.CvVersion, (cvVersion) => cvVersion.versionSkills, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'cv_version_id' }),
    __metadata("design:type", cv_version_entity_1.CvVersion)
], CvVersionSkill.prototype, "cvVersion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => skill_entity_1.Skill, (skill) => skill.versionSkills, {
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'skill_id' }),
    __metadata("design:type", skill_entity_1.Skill)
], CvVersionSkill.prototype, "skill", void 0);
exports.CvVersionSkill = CvVersionSkill = __decorate([
    (0, typeorm_1.Entity)({ name: 'cv_version_skills' }),
    (0, typeorm_1.Unique)('uq_cv_version_skills', ['cvVersionId', 'skillId'])
], CvVersionSkill);
//# sourceMappingURL=cv-version-skill.entity.js.map