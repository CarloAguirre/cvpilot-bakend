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
exports.SystemEvent = void 0;
const typeorm_1 = require("typeorm");
const cv_version_entity_1 = require("../../cvs/entities/cv-version.entity");
const cv_entity_1 = require("../../cvs/entities/cv.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let SystemEvent = class SystemEvent {
    id;
    userId;
    cvId;
    cvVersionId;
    eventType;
    eventDetail;
    createdAt;
    user;
    cv;
    cvVersion;
};
exports.SystemEvent = SystemEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], SystemEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", String)
], SystemEvent.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cv_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], SystemEvent.prototype, "cvId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cv_version_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], SystemEvent.prototype, "cvVersionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], SystemEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_detail', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SystemEvent.prototype, "eventDetail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], SystemEvent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.systemEvents, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], SystemEvent.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cv_entity_1.Cv, (cv) => cv.systemEvents, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'cv_id' }),
    __metadata("design:type", Object)
], SystemEvent.prototype, "cv", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cv_version_entity_1.CvVersion, (cvVersion) => cvVersion.systemEvents, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'cv_version_id' }),
    __metadata("design:type", Object)
], SystemEvent.prototype, "cvVersion", void 0);
exports.SystemEvent = SystemEvent = __decorate([
    (0, typeorm_1.Entity)({ name: 'system_events' }),
    (0, typeorm_1.Index)('idx_system_events_user_id', ['userId']),
    (0, typeorm_1.Index)('idx_system_events_cv_id', ['cvId']),
    (0, typeorm_1.Index)('idx_system_events_cv_version_id', ['cvVersionId']),
    (0, typeorm_1.Index)('idx_system_events_event_type', ['eventType']),
    (0, typeorm_1.Index)('idx_system_events_created_at', ['createdAt'])
], SystemEvent);
//# sourceMappingURL=system-event.entity.js.map