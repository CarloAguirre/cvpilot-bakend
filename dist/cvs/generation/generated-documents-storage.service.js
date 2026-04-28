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
exports.GeneratedDocumentsStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
let GeneratedDocumentsStorageService = class GeneratedDocumentsStorageService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async storeCvPdf(userId, pdfBuffer) {
        const uploadRoot = (0, node_path_1.resolve)(process.cwd(), this.configService.get('UPLOAD_DIR') ?? 'uploads');
        const generatedCvRoot = (0, node_path_1.resolve)(process.cwd(), this.configService.get('GENERATED_CV_DIR') ?? 'uploads/generated-cvs');
        const relativeGeneratedRoot = (0, node_path_1.relative)(uploadRoot, generatedCvRoot);
        if (!relativeGeneratedRoot ||
            relativeGeneratedRoot.startsWith('..') ||
            (0, node_path_1.isAbsolute)(relativeGeneratedRoot)) {
            throw new common_1.InternalServerErrorException('GENERATED_CV_DIR must be inside UPLOAD_DIR');
        }
        const destinationDir = (0, node_path_1.resolve)(generatedCvRoot, userId);
        await (0, promises_1.mkdir)(destinationDir, { recursive: true });
        const fileName = `cv-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
        const absoluteFilePath = (0, node_path_1.resolve)(destinationDir, fileName);
        await (0, promises_1.writeFile)(absoluteFilePath, pdfBuffer);
        const relativeWithinUploadRoot = (0, node_path_1.relative)(uploadRoot, absoluteFilePath).replaceAll('\\', '/');
        const appBaseUrl = this.configService.get('APP_BASE_URL')?.replace(/\/$/, '') ??
            `http://localhost:${this.configService.get('PORT') ?? '3000'}`;
        return {
            absoluteFilePath,
            relativeWithinUploadRoot,
            publicUrl: `${appBaseUrl}/uploads/${relativeWithinUploadRoot}`,
        };
    }
};
exports.GeneratedDocumentsStorageService = GeneratedDocumentsStorageService;
exports.GeneratedDocumentsStorageService = GeneratedDocumentsStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeneratedDocumentsStorageService);
//# sourceMappingURL=generated-documents-storage.service.js.map