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
exports.CreateImprovedCvVersionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const database_enums_1 = require("../../common/enums/database.enums");
const create_cv_dto_1 = require("./create-cv.dto");
class CreateImprovedCvVersionDto {
    targetRole;
    jobDescription;
    summaryText;
    skillsText;
    stylePreset;
    generatedFileUrl;
    generatedFileFormat;
    createdByProcess;
    resultSourceType;
    improvementRequestId;
    skills;
    workExperiences;
    educationEntries;
}
exports.CreateImprovedCvVersionDto = CreateImprovedCvVersionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateImprovedCvVersionDto.prototype, "targetRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImprovedCvVersionDto.prototype, "jobDescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImprovedCvVersionDto.prototype, "summaryText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImprovedCvVersionDto.prototype, "skillsText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(database_enums_1.CvStylePreset),
    __metadata("design:type", String)
], CreateImprovedCvVersionDto.prototype, "stylePreset", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImprovedCvVersionDto.prototype, "generatedFileUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(database_enums_1.GeneratedFileFormat),
    __metadata("design:type", String)
], CreateImprovedCvVersionDto.prototype, "generatedFileFormat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(database_enums_1.CreatedByProcess),
    __metadata("design:type", String)
], CreateImprovedCvVersionDto.prototype, "createdByProcess", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(database_enums_1.CvSourceType),
    __metadata("design:type", String)
], CreateImprovedCvVersionDto.prototype, "resultSourceType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImprovedCvVersionDto.prototype, "improvementRequestId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateImprovedCvVersionDto.prototype, "skills", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(30),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_cv_dto_1.CreateCvWorkExperienceDto),
    __metadata("design:type", Array)
], CreateImprovedCvVersionDto.prototype, "workExperiences", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_cv_dto_1.CreateCvEducationEntryDto),
    __metadata("design:type", Array)
], CreateImprovedCvVersionDto.prototype, "educationEntries", void 0);
//# sourceMappingURL=create-improved-cv-version.dto.js.map