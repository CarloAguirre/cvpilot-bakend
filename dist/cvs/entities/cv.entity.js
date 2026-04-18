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
exports.Cv = void 0;
const typeorm_1 = require("typeorm");
const timestamped_entity_1 = require("../../common/entities/timestamped.entity");
const database_enums_1 = require("../../common/enums/database.enums");
const system_event_entity_1 = require("../../events/entities/system-event.entity");
const cv_improvement_request_entity_1 = require("../../improvements/entities/cv-improvement-request.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const cv_version_entity_1 = require("./cv-version.entity");
let Cv = class Cv extends timestamped_entity_1.SoftDeleteEntity {
    id;
    userId;
    title;
    targetRole;
    sourceType;
    currentVersionId;
    isArchived;
    user;
    currentVersion;
    versions;
    improvementRequests;
    systemEvents;
};
exports.Cv = Cv;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], Cv.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", String)
], Cv.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], Cv.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_role', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Cv.prototype, "targetRole", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'source_type',
        type: 'varchar',
        length: 20,
        default: database_enums_1.CvSourceType.CREATED,
    }),
    __metadata("design:type", String)
], Cv.prototype, "sourceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_version_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Cv.prototype, "currentVersionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_archived', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Cv.prototype, "isArchived", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.cvs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Cv.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cv_version_entity_1.CvVersion, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'current_version_id' }),
    __metadata("design:type", Object)
], Cv.prototype, "currentVersion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cv_version_entity_1.CvVersion, (cvVersion) => cvVersion.cv),
    __metadata("design:type", Array)
], Cv.prototype, "versions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cv_improvement_request_entity_1.CvImprovementRequest, (cvImprovementRequest) => cvImprovementRequest.cv),
    __metadata("design:type", Array)
], Cv.prototype, "improvementRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => system_event_entity_1.SystemEvent, (systemEvent) => systemEvent.cv),
    __metadata("design:type", Array)
], Cv.prototype, "systemEvents", void 0);
exports.Cv = Cv = __decorate([
    (0, typeorm_1.Entity)({ name: 'cvs' }),
    (0, typeorm_1.Index)('idx_cvs_user_id', ['userId']),
    (0, typeorm_1.Index)('idx_cvs_target_role', ['targetRole']),
    (0, typeorm_1.Index)('idx_cvs_is_archived', ['isArchived'])
], Cv);
//# sourceMappingURL=cv.entity.js.map