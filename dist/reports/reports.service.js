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
const database_enums_1 = require("../common/enums/database.enums");
const report_snapshot_entity_1 = require("./entities/report-snapshot.entity");
let ReportsService = class ReportsService {
    dataSource;
    reportSnapshotsRepository;
    constructor(dataSource, reportSnapshotsRepository) {
        this.dataSource = dataSource;
        this.reportSnapshotsRepository = reportSnapshotsRepository;
    }
    async getDashboardSummary(userId) {
        const [totals] = await this.dataSource.query(`
        SELECT
          COUNT(DISTINCT c.id)::int AS "totalCvs",
          COUNT(v.id)::int AS "totalVersions",
          COUNT(*) FILTER (WHERE v.version_type = $2)::int AS "totalCreatedVersions",
          COUNT(*) FILTER (WHERE v.version_type = $3)::int AS "totalImprovedVersions",
          MAX(GREATEST(COALESCE(c.updated_at, c.created_at), COALESCE(v.updated_at, v.created_at))) AS "lastActivityAt"
        FROM cvs c
        LEFT JOIN cv_versions v ON v.cv_id = c.id
        WHERE c.user_id = $1
          AND c.deleted_at IS NULL
      `, [userId, database_enums_1.CvVersionType.CREATED, database_enums_1.CvVersionType.IMPROVED]);
        return {
            totalCvs: Number(totals?.totalCvs ?? 0),
            totalVersions: Number(totals?.totalVersions ?? 0),
            totalCreatedVersions: Number(totals?.totalCreatedVersions ?? 0),
            totalImprovedVersions: Number(totals?.totalImprovedVersions ?? 0),
            lastActivityAt: totals?.lastActivityAt ?? null,
        };
    }
    async getReportsByRole(userId) {
        const rows = await this.dataSource.query(`
        SELECT
          v.target_role AS "targetRole",
          COUNT(*)::int AS "totalVersions"
        FROM cv_versions v
        INNER JOIN cvs c ON c.id = v.cv_id
        WHERE c.user_id = $1
          AND c.deleted_at IS NULL
        GROUP BY v.target_role
        ORDER BY "totalVersions" DESC, "targetRole" ASC
      `, [userId]);
        return rows.map((row) => ({
            targetRole: row.targetRole,
            totalVersions: Number(row.totalVersions),
        }));
    }
    async getReportsByVersionType(userId) {
        const rows = await this.dataSource.query(`
        SELECT
          v.version_type AS "versionType",
          COUNT(*)::int AS "totalVersions"
        FROM cv_versions v
        INNER JOIN cvs c ON c.id = v.cv_id
        WHERE c.user_id = $1
          AND c.deleted_at IS NULL
        GROUP BY v.version_type
        ORDER BY "totalVersions" DESC, "versionType" ASC
      `, [userId]);
        return rows.map((row) => ({
            versionType: row.versionType,
            totalVersions: Number(row.totalVersions),
        }));
    }
    async getMonthlyReports(userId) {
        const rows = await this.dataSource.query(`
        SELECT
          EXTRACT(YEAR FROM v.created_at)::int AS "reportYear",
          EXTRACT(MONTH FROM v.created_at)::int AS "reportMonth",
          COUNT(*)::int AS "totalVersions"
        FROM cv_versions v
        INNER JOIN cvs c ON c.id = v.cv_id
        WHERE c.user_id = $1
          AND c.deleted_at IS NULL
        GROUP BY EXTRACT(YEAR FROM v.created_at), EXTRACT(MONTH FROM v.created_at)
        ORDER BY "reportYear" ASC, "reportMonth" ASC
      `, [userId]);
        return rows.map((row) => ({
            reportYear: Number(row.reportYear),
            reportMonth: Number(row.reportMonth),
            totalVersions: Number(row.totalVersions),
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
            payload,
            generatedAt: new Date(),
        });
        const savedSnapshot = await this.reportSnapshotsRepository.save(snapshot);
        return this.toSnapshotResponse(savedSnapshot);
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