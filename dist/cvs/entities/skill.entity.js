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
exports.Skill = void 0;
const typeorm_1 = require("typeorm");
const timestamped_entity_1 = require("../../common/entities/timestamped.entity");
const cv_version_skill_entity_1 = require("./cv-version-skill.entity");
let Skill = class Skill extends timestamped_entity_1.CreatedAtEntity {
    id;
    name;
    normalizedName;
    category;
    versionSkills;
};
exports.Skill = Skill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], Skill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Skill.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'normalized_name', type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], Skill.prototype, "normalizedName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Skill.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cv_version_skill_entity_1.CvVersionSkill, (cvVersionSkill) => cvVersionSkill.skill),
    __metadata("design:type", Array)
], Skill.prototype, "versionSkills", void 0);
exports.Skill = Skill = __decorate([
    (0, typeorm_1.Entity)({ name: 'skills' }),
    (0, typeorm_1.Index)('idx_skills_category', ['category'])
], Skill);
//# sourceMappingURL=skill.entity.js.map