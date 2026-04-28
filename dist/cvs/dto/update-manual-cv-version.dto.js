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
exports.UpdateManualCvVersionDto = exports.ManualEditCvEducationEntryDto = exports.ManualEditCvWorkExperienceDto = exports.ManualEditCvPersonalDetailsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const database_enums_1 = require("../../common/enums/database.enums");
class ManualEditCvPersonalDetailsDto {
    fullName;
    email;
    phone;
    location;
    professionalSummary;
}
exports.ManualEditCvPersonalDetailsDto = ManualEditCvPersonalDetailsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], ManualEditCvPersonalDetailsDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ManualEditCvPersonalDetailsDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], ManualEditCvPersonalDetailsDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], ManualEditCvPersonalDetailsDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualEditCvPersonalDetailsDto.prototype, "professionalSummary", void 0);
class ManualEditCvWorkExperienceDto {
    companyName;
    jobTitle;
    periodLabel;
    startDate;
    endDate;
    isCurrent;
    description;
}
exports.ManualEditCvWorkExperienceDto = ManualEditCvWorkExperienceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], ManualEditCvWorkExperienceDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], ManualEditCvWorkExperienceDto.prototype, "jobTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ManualEditCvWorkExperienceDto.prototype, "periodLabel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualEditCvWorkExperienceDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualEditCvWorkExperienceDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ManualEditCvWorkExperienceDto.prototype, "isCurrent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualEditCvWorkExperienceDto.prototype, "description", void 0);
class ManualEditCvEducationEntryDto {
    institutionName;
    degreeTitle;
    periodLabel;
    startDate;
    endDate;
}
exports.ManualEditCvEducationEntryDto = ManualEditCvEducationEntryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], ManualEditCvEducationEntryDto.prototype, "institutionName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], ManualEditCvEducationEntryDto.prototype, "degreeTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ManualEditCvEducationEntryDto.prototype, "periodLabel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualEditCvEducationEntryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualEditCvEducationEntryDto.prototype, "endDate", void 0);
class UpdateManualCvVersionDto {
    title;
    targetRole;
    jobDescription;
    summaryText;
    skillsText;
    stylePreset;
    generatedFileUrl;
    generatedFileFormat;
    personalDetails;
    workExperiences;
    educationEntries;
    skills;
}
exports.UpdateManualCvVersionDto = UpdateManualCvVersionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdateManualCvVersionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdateManualCvVersionDto.prototype, "targetRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateManualCvVersionDto.prototype, "jobDescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateManualCvVersionDto.prototype, "summaryText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateManualCvVersionDto.prototype, "skillsText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(database_enums_1.CvStylePreset),
    __metadata("design:type", String)
], UpdateManualCvVersionDto.prototype, "stylePreset", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateManualCvVersionDto.prototype, "generatedFileUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(database_enums_1.GeneratedFileFormat),
    __metadata("design:type", String)
], UpdateManualCvVersionDto.prototype, "generatedFileFormat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ManualEditCvPersonalDetailsDto),
    __metadata("design:type", ManualEditCvPersonalDetailsDto)
], UpdateManualCvVersionDto.prototype, "personalDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(30),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ManualEditCvWorkExperienceDto),
    __metadata("design:type", Array)
], UpdateManualCvVersionDto.prototype, "workExperiences", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ManualEditCvEducationEntryDto),
    __metadata("design:type", Array)
], UpdateManualCvVersionDto.prototype, "educationEntries", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(50),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateManualCvVersionDto.prototype, "skills", void 0);
//# sourceMappingURL=update-manual-cv-version.dto.js.map