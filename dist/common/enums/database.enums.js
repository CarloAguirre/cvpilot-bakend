"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditActionType = exports.CvImprovementRequestStatus = exports.GeneratedFileFormat = exports.CreatedByProcess = exports.CvVersionType = exports.CvSourceType = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["DELETED"] = "deleted";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var CvSourceType;
(function (CvSourceType) {
    CvSourceType["CREATED"] = "created";
    CvSourceType["IMPROVED"] = "improved";
    CvSourceType["MIXED"] = "mixed";
})(CvSourceType || (exports.CvSourceType = CvSourceType = {}));
var CvVersionType;
(function (CvVersionType) {
    CvVersionType["CREATED"] = "created";
    CvVersionType["IMPROVED"] = "improved";
    CvVersionType["MANUAL_EDIT"] = "manual_edit";
})(CvVersionType || (exports.CvVersionType = CvVersionType = {}));
var CreatedByProcess;
(function (CreatedByProcess) {
    CreatedByProcess["MANUAL"] = "manual";
    CreatedByProcess["AI"] = "ai";
})(CreatedByProcess || (exports.CreatedByProcess = CreatedByProcess = {}));
var GeneratedFileFormat;
(function (GeneratedFileFormat) {
    GeneratedFileFormat["PDF"] = "pdf";
    GeneratedFileFormat["DOCX"] = "docx";
})(GeneratedFileFormat || (exports.GeneratedFileFormat = GeneratedFileFormat = {}));
var CvImprovementRequestStatus;
(function (CvImprovementRequestStatus) {
    CvImprovementRequestStatus["PENDING"] = "pending";
    CvImprovementRequestStatus["PROCESSING"] = "processing";
    CvImprovementRequestStatus["COMPLETED"] = "completed";
    CvImprovementRequestStatus["FAILED"] = "failed";
})(CvImprovementRequestStatus || (exports.CvImprovementRequestStatus = CvImprovementRequestStatus = {}));
var AuditActionType;
(function (AuditActionType) {
    AuditActionType["INSERT"] = "INSERT";
    AuditActionType["UPDATE"] = "UPDATE";
    AuditActionType["DELETE"] = "DELETE";
})(AuditActionType || (exports.AuditActionType = AuditActionType = {}));
//# sourceMappingURL=database.enums.js.map