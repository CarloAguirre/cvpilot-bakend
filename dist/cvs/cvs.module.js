"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cvs_controller_1 = require("./cvs.controller");
const cvs_service_1 = require("./cvs.service");
const cv_education_entry_entity_1 = require("./entities/cv-education-entry.entity");
const cv_personal_detail_entity_1 = require("./entities/cv-personal-detail.entity");
const cv_version_skill_entity_1 = require("./entities/cv-version-skill.entity");
const cv_version_entity_1 = require("./entities/cv-version.entity");
const cv_work_experience_entity_1 = require("./entities/cv-work-experience.entity");
const cv_entity_1 = require("./entities/cv.entity");
const cv_generation_workflow_service_1 = require("./generation/cv-generation-workflow.service");
const cv_document_text_extractor_service_1 = require("./generation/cv-document-text-extractor.service");
const cv_pdf_render_service_1 = require("./generation/cv-pdf-render.service");
const cv_prompt_builder_service_1 = require("./generation/cv-prompt-builder.service");
const generated_documents_storage_service_1 = require("./generation/generated-documents-storage.service");
const openai_cv_generator_service_1 = require("./generation/openai-cv-generator.service");
const skill_entity_1 = require("./entities/skill.entity");
let CvsModule = class CvsModule {
};
exports.CvsModule = CvsModule;
exports.CvsModule = CvsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                cv_entity_1.Cv,
                cv_version_entity_1.CvVersion,
                cv_personal_detail_entity_1.CvPersonalDetail,
                cv_work_experience_entity_1.CvWorkExperience,
                cv_education_entry_entity_1.CvEducationEntry,
                skill_entity_1.Skill,
                cv_version_skill_entity_1.CvVersionSkill,
            ]),
        ],
        controllers: [cvs_controller_1.CvsController],
        providers: [
            cvs_service_1.CvsService,
            cv_document_text_extractor_service_1.CvDocumentTextExtractorService,
            cv_generation_workflow_service_1.CvGenerationWorkflowService,
            cv_pdf_render_service_1.CvPdfRenderService,
            cv_prompt_builder_service_1.CvPromptBuilderService,
            generated_documents_storage_service_1.GeneratedDocumentsStorageService,
            openai_cv_generator_service_1.OpenAiCvGeneratorService,
        ],
        exports: [typeorm_1.TypeOrmModule, cvs_service_1.CvsService, cv_generation_workflow_service_1.CvGenerationWorkflowService],
    })
], CvsModule);
//# sourceMappingURL=cvs.module.js.map