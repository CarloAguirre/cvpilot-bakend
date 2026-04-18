"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImprovementsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cv_version_entity_1 = require("../cvs/entities/cv-version.entity");
const cv_entity_1 = require("../cvs/entities/cv.entity");
const uploaded_file_entity_1 = require("../files/entities/uploaded-file.entity");
const cv_improvement_request_entity_1 = require("./entities/cv-improvement-request.entity");
const improvements_controller_1 = require("./improvements.controller");
const improvements_service_1 = require("./improvements.service");
let ImprovementsModule = class ImprovementsModule {
};
exports.ImprovementsModule = ImprovementsModule;
exports.ImprovementsModule = ImprovementsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                cv_improvement_request_entity_1.CvImprovementRequest,
                uploaded_file_entity_1.UploadedFile,
                cv_entity_1.Cv,
                cv_version_entity_1.CvVersion,
            ]),
        ],
        controllers: [improvements_controller_1.ImprovementsController],
        providers: [improvements_service_1.ImprovementsService],
        exports: [typeorm_1.TypeOrmModule, improvements_service_1.ImprovementsService],
    })
], ImprovementsModule);
//# sourceMappingURL=improvements.module.js.map