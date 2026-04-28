"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvDocumentTextExtractorService = void 0;
const common_1 = require("@nestjs/common");
const mammoth_1 = __importDefault(require("mammoth"));
const pdf_parse_1 = require("pdf-parse");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
let CvDocumentTextExtractorService = class CvDocumentTextExtractorService {
    async extractText(storagePath, fileExtension) {
        const normalizedExtension = fileExtension.trim().toLowerCase();
        const absolutePath = (0, node_path_1.resolve)(process.cwd(), storagePath);
        if (normalizedExtension === 'pdf') {
            const fileBuffer = await (0, promises_1.readFile)(absolutePath);
            const parser = new pdf_parse_1.PDFParse({ data: fileBuffer });
            const parsedPdf = await parser.getText();
            await parser.destroy();
            return this.normalizeExtractedText(parsedPdf.text);
        }
        if (normalizedExtension === 'docx') {
            const extractedDocument = await mammoth_1.default.extractRawText({ path: absolutePath });
            return this.normalizeExtractedText(extractedDocument.value);
        }
        throw new common_1.BadRequestException('Only PDF or DOCX files can be processed');
    }
    normalizeExtractedText(rawText) {
        const normalizedText = (rawText ?? '').replaceAll(/\r\n?/g, '\n').trim();
        if (!normalizedText) {
            throw new common_1.InternalServerErrorException('The uploaded document could not be parsed');
        }
        return normalizedText;
    }
};
exports.CvDocumentTextExtractorService = CvDocumentTextExtractorService;
exports.CvDocumentTextExtractorService = CvDocumentTextExtractorService = __decorate([
    (0, common_1.Injectable)()
], CvDocumentTextExtractorService);
//# sourceMappingURL=cv-document-text-extractor.service.js.map