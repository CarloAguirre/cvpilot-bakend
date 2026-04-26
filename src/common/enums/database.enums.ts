export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export enum CvSourceType {
  CREATED = 'created',
  IMPROVED = 'improved',
  MIXED = 'mixed',
}

export enum CvVersionType {
  CREATED = 'created',
  IMPROVED = 'improved',
  MANUAL_EDIT = 'manual_edit',
}

export enum CreatedByProcess {
  MANUAL = 'manual',
  AI = 'ai',
}

export enum GeneratedFileFormat {
  PDF = 'pdf',
  DOCX = 'docx',
}

export enum CvStylePreset {
  ATS = 'ats',
  HARVARD = 'harvard',
  MODERNO = 'moderno',
}

export enum CvImprovementRequestStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum AuditActionType {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}