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
exports.AuditLog = void 0;
const typeorm_1 = require("typeorm");
const database_enums_1 = require("../../common/enums/database.enums");
const user_entity_1 = require("../../users/entities/user.entity");
let AuditLog = class AuditLog {
    id;
    tableName;
    recordId;
    actionType;
    changedByUserId;
    oldData;
    newData;
    changedAt;
    changedByUser;
};
exports.AuditLog = AuditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'table_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AuditLog.prototype, "tableName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'record_id', type: 'bigint' }),
    __metadata("design:type", String)
], AuditLog.prototype, "recordId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'action_type', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], AuditLog.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'changed_by_user_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "changedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'old_data', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "oldData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'new_data', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "newData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'changed_at', type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], AuditLog.prototype, "changedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.auditLogs, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'changed_by_user_id' }),
    __metadata("design:type", Object)
], AuditLog.prototype, "changedByUser", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)({ name: 'audit_logs' }),
    (0, typeorm_1.Index)('idx_audit_logs_table_record', ['tableName', 'recordId']),
    (0, typeorm_1.Index)('idx_audit_logs_changed_at', ['changedAt'])
], AuditLog);
//# sourceMappingURL=audit-log.entity.js.map