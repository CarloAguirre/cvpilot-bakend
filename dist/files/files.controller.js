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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const create_uploaded_file_dto_1 = require("./dto/create-uploaded-file.dto");
const files_service_1 = require("./files.service");
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.txt']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const resolveUploadDir = (userId) => {
    const uploadRoot = process.env.UPLOAD_DIR ?? 'uploads';
    return (0, node_path_1.join)(process.cwd(), uploadRoot, userId);
};
let FilesController = class FilesController {
    filesService;
    constructor(filesService) {
        this.filesService = filesService;
    }
    listUserFiles(userId) {
        return this.filesService.listUserFiles(userId);
    }
    createFileRecord(userId, createUploadedFileDto) {
        return this.filesService.createFileRecord(userId, createUploadedFileDto);
    }
    uploadFile(userId, file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const normalizedPath = (0, node_path_1.relative)(process.cwd(), file.path).replaceAll('\\', '/');
        return this.filesService.storeUploadedFile(userId, {
            originalName: file.originalname,
            storagePath: normalizedPath,
            mimeType: file.mimetype,
            fileExtension: (0, node_path_1.extname)(file.originalname).replace('.', '').toLowerCase(),
            fileSizeBytes: file.size,
        });
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "listUserFiles", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_uploaded_file_dto_1.CreateUploadedFileDto]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "createFileRecord", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (request, _file, callback) => {
                const userId = request.user?.sub ?? 'anonymous';
                const uploadDir = resolveUploadDir(userId);
                (0, node_fs_1.mkdirSync)(uploadDir, { recursive: true });
                callback(null, uploadDir);
            },
            filename: (_request, file, callback) => {
                const extension = (0, node_path_1.extname)(file.originalname).toLowerCase();
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                callback(null, `${uniqueSuffix}${extension}`);
            },
        }),
        limits: {
            fileSize: MAX_FILE_SIZE_BYTES,
        },
        fileFilter: (_request, file, callback) => {
            const extension = (0, node_path_1.extname)(file.originalname).toLowerCase();
            if (!ALLOWED_EXTENSIONS.has(extension)) {
                callback(new common_1.BadRequestException('Only PDF, DOCX, or TXT documents are allowed'), false);
                return;
            }
            callback(null, true);
        },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "uploadFile", null);
exports.FilesController = FilesController = __decorate([
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map