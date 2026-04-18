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
exports.SoftDeleteEntity = exports.CreatedUpdatedEntity = exports.CreatedAtEntity = void 0;
const typeorm_1 = require("typeorm");
class CreatedAtEntity {
    createdAt;
}
exports.CreatedAtEntity = CreatedAtEntity;
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], CreatedAtEntity.prototype, "createdAt", void 0);
class CreatedUpdatedEntity extends CreatedAtEntity {
    updatedAt;
}
exports.CreatedUpdatedEntity = CreatedUpdatedEntity;
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", Date)
], CreatedUpdatedEntity.prototype, "updatedAt", void 0);
class SoftDeleteEntity extends CreatedUpdatedEntity {
    deletedAt;
}
exports.SoftDeleteEntity = SoftDeleteEntity;
__decorate([
    (0, typeorm_1.DeleteDateColumn)({
        name: 'deleted_at',
        type: 'timestamptz',
        nullable: true,
    }),
    __metadata("design:type", Object)
], SoftDeleteEntity.prototype, "deletedAt", void 0);
//# sourceMappingURL=timestamped.entity.js.map