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
exports.CvsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const create_cv_dto_1 = require("./dto/create-cv.dto");
const create_improved_cv_version_dto_1 = require("./dto/create-improved-cv-version.dto");
const update_cv_archive_dto_1 = require("./dto/update-cv-archive.dto");
const cvs_service_1 = require("./cvs.service");
let CvsController = class CvsController {
    cvsService;
    constructor(cvsService) {
        this.cvsService = cvsService;
    }
    listUserCvs(userId) {
        return this.cvsService.listUserCvs(userId);
    }
    createInitialCv(userId, createCvDto) {
        return this.cvsService.createInitialCv(userId, createCvDto);
    }
    getCv(userId, cvId) {
        return this.cvsService.getCv(userId, cvId);
    }
    getCvHistory(userId, cvId) {
        return this.cvsService.getCvHistory(userId, cvId);
    }
    updateArchiveState(userId, cvId, updateCvArchiveDto) {
        return this.cvsService.updateArchiveState(userId, cvId, updateCvArchiveDto);
    }
    createImprovedVersion(userId, cvId, createImprovedCvVersionDto) {
        return this.cvsService.createImprovedVersion(userId, cvId, createImprovedCvVersionDto);
    }
};
exports.CvsController = CvsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "listUserCvs", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_cv_dto_1.CreateCvDto]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "createInitialCv", null);
__decorate([
    (0, common_1.Get)(':cvId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Param)('cvId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "getCv", null);
__decorate([
    (0, common_1.Get)(':cvId/history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Param)('cvId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "getCvHistory", null);
__decorate([
    (0, common_1.Patch)(':cvId/archive'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Param)('cvId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_cv_archive_dto_1.UpdateCvArchiveDto]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "updateArchiveState", null);
__decorate([
    (0, common_1.Post)(':cvId/versions/improved'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Param)('cvId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_improved_cv_version_dto_1.CreateImprovedCvVersionDto]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "createImprovedVersion", null);
exports.CvsController = CvsController = __decorate([
    (0, common_1.Controller)('cvs'),
    __metadata("design:paramtypes", [cvs_service_1.CvsService])
], CvsController);
//# sourceMappingURL=cvs.controller.js.map