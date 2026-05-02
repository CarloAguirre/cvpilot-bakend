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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_snapshot_entity_1 = require("./entities/report-snapshot.entity");
let ReportsService = class ReportsService {
    dataSource;
    reportSnapshotsRepository;
    constructor(dataSource, reportSnapshotsRepository) {
        this.dataSource = dataSource;
        this.reportSnapshotsRepository = reportSnapshotsRepository;
    }
    async getDashboardSummary(userId) {
        const payload = await this.getCvActivityReportPayload(userId);
        return {
            totalCvs: this.toNumber(payload.totalCvs),
            totalVersions: this.toNumber(payload.totalVersions),
            totalCreatedVersions: this.toNumber(payload.createdVersions),
            totalImprovedVersions: this.toNumber(payload.improvedVersions),
            lastActivityAt: payload.lastActivityAt ?? null,
        };
    }
    async getReportsByRole(userId) {
        const payload = await this.getCvActivityReportPayload(userId);
        return (payload.topTargetRoles ?? [])
            .filter((row) => row.targetRole)
            .map((row) => ({
            targetRole: row.targetRole,
            totalVersions: this.toNumber(row.totalVersions),
        }));
    }
    async getReportsByVersionType(userId) {
        const payload = await this.getCvActivityReportPayload(userId);
        return (payload.versionsByType ?? [])
            .filter((row) => row.versionType)
            .map((row) => ({
            versionType: row.versionType,
            totalVersions: this.toNumber(row.totalVersions),
        }));
    }
    async getMonthlyReports(userId) {
        const payload = await this.getCvActivityReportPayload(userId);
        return (payload.monthlyVersions ?? []).map((row) => ({
            reportYear: this.toNumber(row.reportYear),
            reportMonth: this.toNumber(row.reportMonth),
            totalVersions: this.toNumber(row.totalVersions),
        }));
    }
    async listSnapshots(userId) {
        const snapshots = await this.reportSnapshotsRepository.find({
            where: { userId },
            order: { generatedAt: 'DESC' },
        });
        return snapshots.map((snapshot) => this.toSnapshotResponse(snapshot));
    }
    async createSnapshot(userId, createReportSnapshotDto) {
        const payload = await this.buildPayload(userId, createReportSnapshotDto.reportType);
        const snapshot = this.reportSnapshotsRepository.create({
            userId,
            reportType: createReportSnapshotDto.reportType.trim(),
            reportPeriod: createReportSnapshotDto.reportPeriod?.trim() ?? null,
            payload: payload,
            generatedAt: new Date(),
        });
        const savedSnapshot = await this.reportSnapshotsRepository.save(snapshot);
        return this.toSnapshotResponse(savedSnapshot);
    }
    async createDatabaseSnapshot(userId) {
        const snapshot = await this.generateCvActivitySnapshot(userId);
        return this.toSnapshotResponse(snapshot);
    }
    async getCvActivityReportPayload(userId) {
        const snapshot = await this.generateCvActivitySnapshot(userId);
        return this.toCvActivityReportPayload(snapshot.payload);
    }
    async generateCvActivitySnapshot(userId) {
        await this.dataSource.query('CALL sp_generate_user_cv_report_snapshot($1::bigint)', [userId]);
        const snapshot = await this.reportSnapshotsRepository.findOne({
            where: {
                userId,
                reportType: 'cv_activity_summary',
            },
            order: { generatedAt: 'DESC' },
        });
        if (!snapshot) {
            throw new common_1.InternalServerErrorException('Database report snapshot was not generated');
        }
        return snapshot;
    }
    toCvActivityReportPayload(payload) {
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            return {};
        }
        return payload;
    }
    toNumber(value) {
        const numericValue = Number(value ?? 0);
        return Number.isFinite(numericValue) ? numericValue : 0;
    }
    async buildPayload(userId, reportType) {
        switch (reportType.trim()) {
            case 'dashboard_summary':
                return this.getDashboardSummary(userId);
            case 'by_role':
                return this.getReportsByRole(userId);
            case 'by_version_type':
                return this.getReportsByVersionType(userId);
            case 'monthly':
                return this.getMonthlyReports(userId);
            default:
                return {
                    message: 'Unsupported report type',
                    reportType,
                };
        }
    }
    toSnapshotResponse(snapshot) {
        return {
            id: snapshot.id,
            userId: snapshot.userId,
            reportType: snapshot.reportType,
            reportPeriod: snapshot.reportPeriod,
            payload: snapshot.payload,
            generatedAt: snapshot.generatedAt,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(report_snapshot_entity_1.ReportSnapshot)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map