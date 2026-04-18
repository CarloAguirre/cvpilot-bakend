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
exports.ReportSnapshot = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let ReportSnapshot = class ReportSnapshot {
    id;
    userId;
    reportType;
    reportPeriod;
    payload;
    generatedAt;
    user;
};
exports.ReportSnapshot = ReportSnapshot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], ReportSnapshot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", String)
], ReportSnapshot.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'report_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ReportSnapshot.prototype, "reportType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'report_period', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], ReportSnapshot.prototype, "reportPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payload', type: 'jsonb' }),
    __metadata("design:type", Object)
], ReportSnapshot.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'generated_at', type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], ReportSnapshot.prototype, "generatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.reportSnapshots, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ReportSnapshot.prototype, "user", void 0);
exports.ReportSnapshot = ReportSnapshot = __decorate([
    (0, typeorm_1.Entity)({ name: 'report_snapshots' }),
    (0, typeorm_1.Index)('idx_report_snapshots_user_id', ['userId']),
    (0, typeorm_1.Index)('idx_report_snapshots_report_type', ['reportType'])
], ReportSnapshot);
//# sourceMappingURL=report-snapshot.entity.js.map