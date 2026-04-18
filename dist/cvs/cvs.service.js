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
exports.CvsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const database_enums_1 = require("../common/enums/database.enums");
const cv_improvement_request_entity_1 = require("../improvements/entities/cv-improvement-request.entity");
const cv_education_entry_entity_1 = require("./entities/cv-education-entry.entity");
const cv_personal_detail_entity_1 = require("./entities/cv-personal-detail.entity");
const cv_version_skill_entity_1 = require("./entities/cv-version-skill.entity");
const cv_version_entity_1 = require("./entities/cv-version.entity");
const cv_work_experience_entity_1 = require("./entities/cv-work-experience.entity");
const cv_entity_1 = require("./entities/cv.entity");
const skill_entity_1 = require("./entities/skill.entity");
let CvsService = class CvsService {
    dataSource;
    cvsRepository;
    cvVersionsRepository;
    cvPersonalDetailsRepository;
    cvWorkExperiencesRepository;
    cvEducationEntriesRepository;
    skillsRepository;
    cvVersionSkillsRepository;
    constructor(dataSource, cvsRepository, cvVersionsRepository, cvPersonalDetailsRepository, cvWorkExperiencesRepository, cvEducationEntriesRepository, skillsRepository, cvVersionSkillsRepository) {
        this.dataSource = dataSource;
        this.cvsRepository = cvsRepository;
        this.cvVersionsRepository = cvVersionsRepository;
        this.cvPersonalDetailsRepository = cvPersonalDetailsRepository;
        this.cvWorkExperiencesRepository = cvWorkExperiencesRepository;
        this.cvEducationEntriesRepository = cvEducationEntriesRepository;
        this.skillsRepository = skillsRepository;
        this.cvVersionSkillsRepository = cvVersionSkillsRepository;
    }
    async listUserCvs(userId) {
        const cvs = await this.cvsRepository
            .createQueryBuilder('cv')
            .leftJoinAndSelect('cv.currentVersion', 'currentVersion')
            .loadRelationCountAndMap('cv.versionsCount', 'cv.versions')
            .where('cv.userId = :userId', { userId })
            .orderBy('cv.updatedAt', 'DESC')
            .getMany();
        return cvs.map((cv) => this.toCvListItem(cv));
    }
    async getCv(userId, cvId) {
        const cv = await this.findCvOrFail(userId, cvId);
        return this.toCvResponse(cv);
    }
    async getCvHistory(userId, cvId) {
        const cv = await this.findCvOrFail(userId, cvId);
        return {
            cvId: cv.id,
            title: cv.title,
            targetRole: cv.targetRole,
            versions: [...cv.versions]
                .sort((left, right) => right.versionNumber - left.versionNumber)
                .map((version) => this.toCvVersionSummary(version)),
        };
    }
    async updateArchiveState(userId, cvId, updateCvArchiveDto) {
        const cv = await this.cvsRepository.findOne({
            where: { id: cvId, userId },
        });
        if (!cv) {
            throw new common_1.NotFoundException('CV not found');
        }
        cv.isArchived = updateCvArchiveDto.isArchived;
        const savedCv = await this.cvsRepository.save(cv);
        return this.toCvListItem(savedCv);
    }
    async createInitialCv(userId, createCvDto) {
        const savedCv = await this.dataSource.transaction(async (manager) => {
            const cvRepository = manager.getRepository(cv_entity_1.Cv);
            const cvVersionRepository = manager.getRepository(cv_version_entity_1.CvVersion);
            const cvPersonalDetailsRepository = manager.getRepository(cv_personal_detail_entity_1.CvPersonalDetail);
            const cvWorkExperiencesRepository = manager.getRepository(cv_work_experience_entity_1.CvWorkExperience);
            const cvEducationEntriesRepository = manager.getRepository(cv_education_entry_entity_1.CvEducationEntry);
            const skillsRepository = manager.getRepository(skill_entity_1.Skill);
            const cvVersionSkillsRepository = manager.getRepository(cv_version_skill_entity_1.CvVersionSkill);
            const cv = await cvRepository.save(cvRepository.create({
                userId,
                title: createCvDto.title?.trim() ?? null,
                targetRole: createCvDto.targetRole.trim(),
                sourceType: createCvDto.sourceType?.trim() === database_enums_1.CvSourceType.IMPROVED
                    ? database_enums_1.CvSourceType.IMPROVED
                    : database_enums_1.CvSourceType.CREATED,
                currentVersionId: null,
                isArchived: false,
            }));
            const version = await cvVersionRepository.save(cvVersionRepository.create({
                cvId: cv.id,
                versionNumber: 1,
                versionType: database_enums_1.CvVersionType.CREATED,
                targetRole: createCvDto.targetRole.trim(),
                jobDescription: createCvDto.jobDescription?.trim() ?? null,
                summaryText: createCvDto.personalDetails.professionalSummary?.trim() ?? null,
                skillsText: createCvDto.skillsText?.trim() ??
                    this.stringifySkillList(createCvDto.skills),
                isCurrent: true,
                createdByProcess: database_enums_1.CreatedByProcess.MANUAL,
            }));
            cv.currentVersionId = version.id;
            await cvRepository.save(cv);
            await cvPersonalDetailsRepository.save(cvPersonalDetailsRepository.create({
                cvVersionId: version.id,
                fullName: createCvDto.personalDetails.fullName.trim(),
                email: createCvDto.personalDetails.email.trim().toLowerCase(),
                phone: createCvDto.personalDetails.phone?.trim() ?? null,
                location: createCvDto.personalDetails.location?.trim() ?? null,
                professionalSummary: createCvDto.personalDetails.professionalSummary?.trim() ?? null,
            }));
            if (createCvDto.workExperiences?.length) {
                await cvWorkExperiencesRepository.save(createCvDto.workExperiences.map((workExperience, index) => cvWorkExperiencesRepository.create({
                    cvVersionId: version.id,
                    companyName: workExperience.companyName.trim(),
                    jobTitle: workExperience.jobTitle.trim(),
                    periodLabel: workExperience.periodLabel.trim(),
                    startDate: workExperience.startDate?.trim() ?? null,
                    endDate: workExperience.endDate?.trim() ?? null,
                    isCurrent: workExperience.isCurrent ?? false,
                    description: workExperience.description?.trim() ?? null,
                    displayOrder: index + 1,
                })));
            }
            if (createCvDto.educationEntries?.length) {
                await cvEducationEntriesRepository.save(createCvDto.educationEntries.map((educationEntry, index) => cvEducationEntriesRepository.create({
                    cvVersionId: version.id,
                    institutionName: educationEntry.institutionName.trim(),
                    degreeTitle: educationEntry.degreeTitle.trim(),
                    periodLabel: educationEntry.periodLabel.trim(),
                    startDate: educationEntry.startDate?.trim() ?? null,
                    endDate: educationEntry.endDate?.trim() ?? null,
                    displayOrder: index + 1,
                })));
            }
            await this.attachSkillsToVersion(version.id, createCvDto.skills, skillsRepository, cvVersionSkillsRepository);
            return cv;
        });
        return this.getCv(userId, savedCv.id);
    }
    async createImprovedVersion(userId, cvId, createImprovedCvVersionDto) {
        const sourceCv = await this.findCvOrFail(userId, cvId);
        const sourceVersion = sourceCv.currentVersion ?? sourceCv.versions[0];
        if (!sourceVersion) {
            throw new common_1.NotFoundException('Current CV version not found');
        }
        await this.dataSource.transaction(async (manager) => {
            const cvRepository = manager.getRepository(cv_entity_1.Cv);
            const cvVersionRepository = manager.getRepository(cv_version_entity_1.CvVersion);
            const cvPersonalDetailsRepository = manager.getRepository(cv_personal_detail_entity_1.CvPersonalDetail);
            const cvWorkExperiencesRepository = manager.getRepository(cv_work_experience_entity_1.CvWorkExperience);
            const cvEducationEntriesRepository = manager.getRepository(cv_education_entry_entity_1.CvEducationEntry);
            const skillsRepository = manager.getRepository(skill_entity_1.Skill);
            const cvVersionSkillsRepository = manager.getRepository(cv_version_skill_entity_1.CvVersionSkill);
            const improvementRequestsRepository = manager.getRepository(cv_improvement_request_entity_1.CvImprovementRequest);
            await cvVersionRepository.update({ cvId: sourceCv.id, isCurrent: true }, { isCurrent: false });
            const latestVersion = await cvVersionRepository.findOne({
                where: { cvId: sourceCv.id },
                order: { versionNumber: 'DESC' },
            });
            const nextVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;
            const newVersion = await cvVersionRepository.save(cvVersionRepository.create({
                cvId: sourceCv.id,
                versionNumber: nextVersionNumber,
                versionType: database_enums_1.CvVersionType.IMPROVED,
                targetRole: createImprovedCvVersionDto.targetRole.trim(),
                jobDescription: createImprovedCvVersionDto.jobDescription?.trim() ??
                    sourceVersion.jobDescription,
                summaryText: createImprovedCvVersionDto.summaryText?.trim() ??
                    sourceVersion.summaryText,
                skillsText: createImprovedCvVersionDto.skillsText?.trim() ??
                    this.stringifySkillList(createImprovedCvVersionDto.skills) ??
                    sourceVersion.skillsText,
                generatedFileUrl: createImprovedCvVersionDto.generatedFileUrl?.trim() ?? null,
                generatedFileFormat: createImprovedCvVersionDto.generatedFileFormat ?? null,
                isCurrent: true,
                createdByProcess: createImprovedCvVersionDto.createdByProcess ?? database_enums_1.CreatedByProcess.AI,
            }));
            await cvRepository.update(sourceCv.id, {
                currentVersionId: newVersion.id,
                targetRole: createImprovedCvVersionDto.targetRole.trim(),
                sourceType: sourceCv.sourceType === database_enums_1.CvSourceType.CREATED
                    ? database_enums_1.CvSourceType.MIXED
                    : sourceCv.sourceType,
            });
            if (sourceVersion.personalDetail) {
                await cvPersonalDetailsRepository.save(cvPersonalDetailsRepository.create({
                    cvVersionId: newVersion.id,
                    fullName: sourceVersion.personalDetail.fullName,
                    email: sourceVersion.personalDetail.email,
                    phone: sourceVersion.personalDetail.phone,
                    location: sourceVersion.personalDetail.location,
                    professionalSummary: sourceVersion.personalDetail.professionalSummary,
                }));
            }
            if (sourceVersion.workExperiences.length) {
                await cvWorkExperiencesRepository.save(sourceVersion.workExperiences.map((workExperience) => cvWorkExperiencesRepository.create({
                    cvVersionId: newVersion.id,
                    companyName: workExperience.companyName,
                    jobTitle: workExperience.jobTitle,
                    periodLabel: workExperience.periodLabel,
                    startDate: workExperience.startDate,
                    endDate: workExperience.endDate,
                    isCurrent: workExperience.isCurrent,
                    description: workExperience.description,
                    displayOrder: workExperience.displayOrder,
                })));
            }
            if (sourceVersion.educationEntries.length) {
                await cvEducationEntriesRepository.save(sourceVersion.educationEntries.map((educationEntry) => cvEducationEntriesRepository.create({
                    cvVersionId: newVersion.id,
                    institutionName: educationEntry.institutionName,
                    degreeTitle: educationEntry.degreeTitle,
                    periodLabel: educationEntry.periodLabel,
                    startDate: educationEntry.startDate,
                    endDate: educationEntry.endDate,
                    displayOrder: educationEntry.displayOrder,
                })));
            }
            if (createImprovedCvVersionDto.skills?.length) {
                await this.attachSkillsToVersion(newVersion.id, createImprovedCvVersionDto.skills, skillsRepository, cvVersionSkillsRepository);
            }
            else if (sourceVersion.versionSkills.length) {
                await cvVersionSkillsRepository.save(sourceVersion.versionSkills.map((versionSkill) => cvVersionSkillsRepository.create({
                    cvVersionId: newVersion.id,
                    skillId: versionSkill.skillId,
                    displayOrder: versionSkill.displayOrder,
                })));
            }
            if (createImprovedCvVersionDto.improvementRequestId) {
                await improvementRequestsRepository.update({
                    id: createImprovedCvVersionDto.improvementRequestId,
                    userId,
                }, {
                    status: database_enums_1.CvImprovementRequestStatus.COMPLETED,
                    resultCvVersionId: newVersion.id,
                    errorMessage: null,
                });
            }
        });
        return this.getCv(userId, cvId);
    }
    async findCvOrFail(userId, cvId) {
        const cv = await this.cvsRepository.findOne({
            where: { id: cvId, userId },
            relations: {
                currentVersion: {
                    personalDetail: true,
                    workExperiences: true,
                    educationEntries: true,
                    versionSkills: { skill: true },
                },
                versions: {
                    personalDetail: true,
                    workExperiences: true,
                    educationEntries: true,
                    versionSkills: { skill: true },
                },
            },
        });
        if (!cv) {
            throw new common_1.NotFoundException('CV not found');
        }
        cv.versions = [...cv.versions].sort((left, right) => right.versionNumber - left.versionNumber);
        for (const version of cv.versions) {
            version.workExperiences = [...version.workExperiences].sort((left, right) => left.displayOrder - right.displayOrder);
            version.educationEntries = [...version.educationEntries].sort((left, right) => left.displayOrder - right.displayOrder);
            version.versionSkills = [...version.versionSkills].sort((left, right) => left.displayOrder - right.displayOrder);
        }
        return cv;
    }
    async attachSkillsToVersion(cvVersionId, skills, skillsRepository, cvVersionSkillsRepository) {
        const normalizedSkills = this.normalizeSkills(skills);
        if (!normalizedSkills.length) {
            return;
        }
        for (const [index, skillName] of normalizedSkills.entries()) {
            const normalizedName = this.normalizeSkillName(skillName);
            let skill = await skillsRepository.findOne({
                where: { normalizedName },
            });
            skill ??= await skillsRepository.save(skillsRepository.create({
                name: skillName,
                normalizedName,
                category: null,
            }));
            await cvVersionSkillsRepository.save(cvVersionSkillsRepository.create({
                cvVersionId,
                skillId: skill.id,
                displayOrder: index + 1,
            }));
        }
    }
    normalizeSkills(skills) {
        return [...new Set((skills ?? []).map((skill) => skill.trim()).filter(Boolean))];
    }
    normalizeSkillName(skill) {
        return skill.trim().toLowerCase().replaceAll(/\s+/g, ' ');
    }
    stringifySkillList(skills) {
        const normalizedSkills = this.normalizeSkills(skills);
        return normalizedSkills.length ? normalizedSkills.join(', ') : null;
    }
    toCvListItem(cv) {
        const versionCount = Number(cv.versionsCount ?? cv.versions?.length ?? 0);
        return {
            id: cv.id,
            userId: cv.userId,
            title: cv.title,
            targetRole: cv.targetRole,
            sourceType: cv.sourceType,
            currentVersionId: cv.currentVersionId,
            isArchived: cv.isArchived,
            versionsCount: versionCount,
            currentVersion: cv.currentVersion
                ? this.toCvVersionSummary(cv.currentVersion)
                : null,
            createdAt: cv.createdAt,
            updatedAt: cv.updatedAt,
            deletedAt: cv.deletedAt,
        };
    }
    toCvResponse(cv) {
        return {
            id: cv.id,
            userId: cv.userId,
            title: cv.title,
            targetRole: cv.targetRole,
            sourceType: cv.sourceType,
            currentVersionId: cv.currentVersionId,
            isArchived: cv.isArchived,
            currentVersion: cv.currentVersion
                ? this.toCvVersionDetail(cv.currentVersion)
                : null,
            versions: cv.versions.map((version) => this.toCvVersionDetail(version)),
            createdAt: cv.createdAt,
            updatedAt: cv.updatedAt,
            deletedAt: cv.deletedAt,
        };
    }
    toCvVersionSummary(version) {
        return {
            id: version.id,
            cvId: version.cvId,
            versionNumber: version.versionNumber,
            versionType: version.versionType,
            targetRole: version.targetRole,
            isCurrent: version.isCurrent,
            createdByProcess: version.createdByProcess,
            generatedFileUrl: version.generatedFileUrl,
            generatedFileFormat: version.generatedFileFormat,
            createdAt: version.createdAt,
            updatedAt: version.updatedAt,
        };
    }
    toCvVersionDetail(version) {
        return {
            ...this.toCvVersionSummary(version),
            jobDescription: version.jobDescription,
            summaryText: version.summaryText,
            skillsText: version.skillsText,
            personalDetail: version.personalDetail
                ? {
                    id: version.personalDetail.id,
                    cvVersionId: version.personalDetail.cvVersionId,
                    fullName: version.personalDetail.fullName,
                    email: version.personalDetail.email,
                    phone: version.personalDetail.phone,
                    location: version.personalDetail.location,
                    professionalSummary: version.personalDetail.professionalSummary,
                    createdAt: version.personalDetail.createdAt,
                    updatedAt: version.personalDetail.updatedAt,
                }
                : null,
            workExperiences: version.workExperiences.map((workExperience) => ({
                id: workExperience.id,
                cvVersionId: workExperience.cvVersionId,
                companyName: workExperience.companyName,
                jobTitle: workExperience.jobTitle,
                periodLabel: workExperience.periodLabel,
                startDate: workExperience.startDate,
                endDate: workExperience.endDate,
                isCurrent: workExperience.isCurrent,
                description: workExperience.description,
                displayOrder: workExperience.displayOrder,
                createdAt: workExperience.createdAt,
                updatedAt: workExperience.updatedAt,
            })),
            educationEntries: version.educationEntries.map((educationEntry) => ({
                id: educationEntry.id,
                cvVersionId: educationEntry.cvVersionId,
                institutionName: educationEntry.institutionName,
                degreeTitle: educationEntry.degreeTitle,
                periodLabel: educationEntry.periodLabel,
                startDate: educationEntry.startDate,
                endDate: educationEntry.endDate,
                displayOrder: educationEntry.displayOrder,
                createdAt: educationEntry.createdAt,
                updatedAt: educationEntry.updatedAt,
            })),
            skills: version.versionSkills.map((versionSkill) => ({
                id: versionSkill.id,
                cvVersionId: versionSkill.cvVersionId,
                skillId: versionSkill.skillId,
                displayOrder: versionSkill.displayOrder,
                skill: versionSkill.skill
                    ? {
                        id: versionSkill.skill.id,
                        name: versionSkill.skill.name,
                        normalizedName: versionSkill.skill.normalizedName,
                        category: versionSkill.skill.category,
                        createdAt: versionSkill.skill.createdAt,
                    }
                    : null,
            })),
        };
    }
};
exports.CvsService = CvsService;
exports.CvsService = CvsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(cv_entity_1.Cv)),
    __param(2, (0, typeorm_1.InjectRepository)(cv_version_entity_1.CvVersion)),
    __param(3, (0, typeorm_1.InjectRepository)(cv_personal_detail_entity_1.CvPersonalDetail)),
    __param(4, (0, typeorm_1.InjectRepository)(cv_work_experience_entity_1.CvWorkExperience)),
    __param(5, (0, typeorm_1.InjectRepository)(cv_education_entry_entity_1.CvEducationEntry)),
    __param(6, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __param(7, (0, typeorm_1.InjectRepository)(cv_version_skill_entity_1.CvVersionSkill)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CvsService);
//# sourceMappingURL=cvs.service.js.map