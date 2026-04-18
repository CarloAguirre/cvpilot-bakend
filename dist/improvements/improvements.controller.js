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
exports.ImprovementsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const create_cv_improvement_request_dto_1 = require("./dto/create-cv-improvement-request.dto");
const update_cv_improvement_request_dto_1 = require("./dto/update-cv-improvement-request.dto");
const improvements_service_1 = require("./improvements.service");
let ImprovementsController = class ImprovementsController {
    improvementsService;
    constructor(improvementsService) {
        this.improvementsService = improvementsService;
    }
    listRequests(userId) {
        return this.improvementsService.listRequests(userId);
    }
    createRequest(userId, createCvImprovementRequestDto) {
        return this.improvementsService.createRequest(userId, createCvImprovementRequestDto);
    }
    updateRequest(userId, requestId, updateCvImprovementRequestDto) {
        return this.improvementsService.updateRequest(userId, requestId, updateCvImprovementRequestDto);
    }
};
exports.ImprovementsController = ImprovementsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImprovementsController.prototype, "listRequests", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_cv_improvement_request_dto_1.CreateCvImprovementRequestDto]),
    __metadata("design:returntype", void 0)
], ImprovementsController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Patch)(':requestId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Param)('requestId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_cv_improvement_request_dto_1.UpdateCvImprovementRequestDto]),
    __metadata("design:returntype", void 0)
], ImprovementsController.prototype, "updateRequest", null);
exports.ImprovementsController = ImprovementsController = __decorate([
    (0, common_1.Controller)('improvement-requests'),
    __metadata("design:paramtypes", [improvements_service_1.ImprovementsService])
], ImprovementsController);
//# sourceMappingURL=improvements.controller.js.map