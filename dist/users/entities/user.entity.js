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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const timestamped_entity_1 = require("../../common/entities/timestamped.entity");
const database_enums_1 = require("../../common/enums/database.enums");
const audit_log_entity_1 = require("../../audit/entities/audit-log.entity");
const cv_entity_1 = require("../../cvs/entities/cv.entity");
const system_event_entity_1 = require("../../events/entities/system-event.entity");
const uploaded_file_entity_1 = require("../../files/entities/uploaded-file.entity");
const cv_improvement_request_entity_1 = require("../../improvements/entities/cv-improvement-request.entity");
const report_snapshot_entity_1 = require("../../reports/entities/report-snapshot.entity");
const user_setting_entity_1 = require("./user-setting.entity");
let User = class User extends timestamped_entity_1.SoftDeleteEntity {
    id;
    fullName;
    email;
    passwordHash;
    status;
    lastLoginAt;
    setting;
    cvs;
    uploadedFiles;
    cvImprovementRequests;
    reportSnapshots;
    auditLogs;
    systemEvents;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 150, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'varchar',
        length: 20,
        default: database_enums_1.UserStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_setting_entity_1.UserSetting, (userSetting) => userSetting.user),
    __metadata("design:type", user_setting_entity_1.UserSetting)
], User.prototype, "setting", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cv_entity_1.Cv, (cv) => cv.user),
    __metadata("design:type", Array)
], User.prototype, "cvs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => uploaded_file_entity_1.UploadedFile, (uploadedFile) => uploadedFile.user),
    __metadata("design:type", Array)
], User.prototype, "uploadedFiles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cv_improvement_request_entity_1.CvImprovementRequest, (cvImprovementRequest) => cvImprovementRequest.user),
    __metadata("design:type", Array)
], User.prototype, "cvImprovementRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_snapshot_entity_1.ReportSnapshot, (reportSnapshot) => reportSnapshot.user),
    __metadata("design:type", Array)
], User.prototype, "reportSnapshots", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => audit_log_entity_1.AuditLog, (auditLog) => auditLog.changedByUser),
    __metadata("design:type", Array)
], User.prototype, "auditLogs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => system_event_entity_1.SystemEvent, (systemEvent) => systemEvent.user),
    __metadata("design:type", Array)
], User.prototype, "systemEvents", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' }),
    (0, typeorm_1.Index)('idx_users_status', ['status'])
], User);
//# sourceMappingURL=user.entity.js.map