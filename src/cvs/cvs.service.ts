import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  CreatedByProcess,
  CvImprovementRequestStatus,
  CvSourceType,
  CvStylePreset,
  CvVersionType,
} from '../common/enums/database.enums';
import { CvImprovementRequest } from '../improvements/entities/cv-improvement-request.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { CreateImprovedCvVersionDto } from './dto/create-improved-cv-version.dto';
import { UpdateCvArchiveDto } from './dto/update-cv-archive.dto';
import { UpdateManualCvVersionDto } from './dto/update-manual-cv-version.dto';
import { CvEducationEntry } from './entities/cv-education-entry.entity';
import { CvPersonalDetail } from './entities/cv-personal-detail.entity';
import { CvVersionSkill } from './entities/cv-version-skill.entity';
import { CvVersion } from './entities/cv-version.entity';
import { CvWorkExperience } from './entities/cv-work-experience.entity';
import { Cv } from './entities/cv.entity';
import { Skill } from './entities/skill.entity';

@Injectable()
export class CvsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Cv)
    readonly cvsRepository: Repository<Cv>,
    @InjectRepository(CvVersion)
    readonly cvVersionsRepository: Repository<CvVersion>,
    @InjectRepository(CvPersonalDetail)
    readonly cvPersonalDetailsRepository: Repository<CvPersonalDetail>,
    @InjectRepository(CvWorkExperience)
    readonly cvWorkExperiencesRepository: Repository<CvWorkExperience>,
    @InjectRepository(CvEducationEntry)
    readonly cvEducationEntriesRepository: Repository<CvEducationEntry>,
    @InjectRepository(Skill)
    readonly skillsRepository: Repository<Skill>,
    @InjectRepository(CvVersionSkill)
    readonly cvVersionSkillsRepository: Repository<CvVersionSkill>,
  ) {}

  async listUserCvs(userId: string) {
    const cvs = await this.cvsRepository
      .createQueryBuilder('cv')
      .leftJoinAndSelect('cv.currentVersion', 'currentVersion')
      .loadRelationCountAndMap('cv.versionsCount', 'cv.versions')
      .where('cv.userId = :userId', { userId })
      .orderBy('cv.updatedAt', 'DESC')
      .getMany();

    return cvs.map((cv) => this.toCvListItem(cv));
  }

  async getCv(userId: string, cvId: string) {
    const cv = await this.findCvOrFail(userId, cvId);
    return this.toCvResponse(cv);
  }

  async getCvHistory(userId: string, cvId: string) {
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

  async updateArchiveState(
    userId: string,
    cvId: string,
    updateCvArchiveDto: UpdateCvArchiveDto,
  ) {
    const cv = await this.cvsRepository.findOne({
      where: { id: cvId, userId },
    });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    cv.isArchived = updateCvArchiveDto.isArchived;
    const savedCv = await this.cvsRepository.save(cv);
    return this.toCvListItem(savedCv);
  }

  async createInitialCv(userId: string, createCvDto: CreateCvDto) {
    const savedCv = await this.dataSource.transaction(async (manager) => {
      const cvRepository = manager.getRepository(Cv);
      const cvVersionRepository = manager.getRepository(CvVersion);
      const cvPersonalDetailsRepository = manager.getRepository(CvPersonalDetail);
      const cvWorkExperiencesRepository = manager.getRepository(CvWorkExperience);
      const cvEducationEntriesRepository = manager.getRepository(CvEducationEntry);
      const skillsRepository = manager.getRepository(Skill);
      const cvVersionSkillsRepository = manager.getRepository(CvVersionSkill);

      const cv = await cvRepository.save(
        cvRepository.create({
          userId,
          title: createCvDto.title?.trim() ?? null,
          targetRole: createCvDto.targetRole.trim(),
          sourceType:
            createCvDto.sourceType === CvSourceType.IMPROVED
              ? CvSourceType.IMPROVED
              : CvSourceType.CREATED,
          currentVersionId: null,
          isArchived: false,
        }),
      );

      const version = await cvVersionRepository.save(
        cvVersionRepository.create({
          cvId: cv.id,
          versionNumber: 1,
          versionType: CvVersionType.CREATED,
          targetRole: createCvDto.targetRole.trim(),
          jobDescription: createCvDto.jobDescription?.trim() ?? null,
          summaryText:
            createCvDto.personalDetails.professionalSummary?.trim() ?? null,
          skillsText:
            createCvDto.skillsText?.trim() ??
            this.stringifySkillList(createCvDto.skills),
          stylePreset: createCvDto.stylePreset ?? CvStylePreset.ATS,
          isCurrent: true,
          createdByProcess: CreatedByProcess.MANUAL,
        }),
      );

      cv.currentVersionId = version.id;
      await cvRepository.save(cv);

      await cvPersonalDetailsRepository.save(
        cvPersonalDetailsRepository.create({
          cvVersionId: version.id,
          fullName: createCvDto.personalDetails.fullName.trim(),
          email: createCvDto.personalDetails.email.trim().toLowerCase(),
          phone: createCvDto.personalDetails.phone?.trim() ?? null,
          location: createCvDto.personalDetails.location?.trim() ?? null,
          professionalSummary:
            createCvDto.personalDetails.professionalSummary?.trim() ?? null,
        }),
      );

      if (createCvDto.workExperiences?.length) {
        await cvWorkExperiencesRepository.save(
          createCvDto.workExperiences.map((workExperience, index) =>
            cvWorkExperiencesRepository.create({
              cvVersionId: version.id,
              companyName: workExperience.companyName.trim(),
              jobTitle: workExperience.jobTitle.trim(),
              periodLabel: workExperience.periodLabel.trim(),
              startDate: workExperience.startDate?.trim() ?? null,
              endDate: workExperience.endDate?.trim() ?? null,
              isCurrent: workExperience.isCurrent ?? false,
              description: workExperience.description?.trim() ?? null,
              displayOrder: index + 1,
            }),
          ),
        );
      }

      if (createCvDto.educationEntries?.length) {
        await cvEducationEntriesRepository.save(
          createCvDto.educationEntries.map((educationEntry, index) =>
            cvEducationEntriesRepository.create({
              cvVersionId: version.id,
              institutionName: educationEntry.institutionName.trim(),
              degreeTitle: educationEntry.degreeTitle.trim(),
              periodLabel: educationEntry.periodLabel.trim(),
              startDate: educationEntry.startDate?.trim() ?? null,
              endDate: educationEntry.endDate?.trim() ?? null,
              displayOrder: index + 1,
            }),
          ),
        );
      }

      await this.attachSkillsToVersion(
        version.id,
        createCvDto.skills,
        skillsRepository,
        cvVersionSkillsRepository,
      );

      return cv;
    });

    return this.getCv(userId, savedCv.id);
  }

  async createImprovedVersion(
    userId: string,
    cvId: string,
    createImprovedCvVersionDto: CreateImprovedCvVersionDto,
  ) {
    const sourceCv = await this.findCvOrFail(userId, cvId);
    const sourceVersion = sourceCv.currentVersion ?? sourceCv.versions[0];

    if (!sourceVersion) {
      throw new NotFoundException('Current CV version not found');
    }

    await this.dataSource.transaction(async (manager) => {
      const cvRepository = manager.getRepository(Cv);
      const cvVersionRepository = manager.getRepository(CvVersion);
      const cvPersonalDetailsRepository = manager.getRepository(CvPersonalDetail);
      const cvWorkExperiencesRepository = manager.getRepository(CvWorkExperience);
      const cvEducationEntriesRepository = manager.getRepository(CvEducationEntry);
      const skillsRepository = manager.getRepository(Skill);
      const cvVersionSkillsRepository = manager.getRepository(CvVersionSkill);
      const improvementRequestsRepository = manager.getRepository(
        CvImprovementRequest,
      );

      await cvVersionRepository.update(
        { cvId: sourceCv.id, isCurrent: true },
        { isCurrent: false },
      );

      const latestVersion = await cvVersionRepository.findOne({
        where: { cvId: sourceCv.id },
        order: { versionNumber: 'DESC' },
      });

      const nextVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;

      const newVersion = await cvVersionRepository.save(
        cvVersionRepository.create({
          cvId: sourceCv.id,
          versionNumber: nextVersionNumber,
          versionType: CvVersionType.IMPROVED,
          targetRole: createImprovedCvVersionDto.targetRole.trim(),
          jobDescription:
            createImprovedCvVersionDto.jobDescription?.trim() ??
            sourceVersion.jobDescription,
          summaryText:
            createImprovedCvVersionDto.summaryText?.trim() ??
            sourceVersion.summaryText,
          skillsText:
            createImprovedCvVersionDto.skillsText?.trim() ??
            this.stringifySkillList(createImprovedCvVersionDto.skills) ??
            sourceVersion.skillsText,
          stylePreset:
            createImprovedCvVersionDto.stylePreset ??
            sourceVersion.stylePreset ??
            CvStylePreset.ATS,
          generatedFileUrl:
            createImprovedCvVersionDto.generatedFileUrl?.trim() ?? null,
          generatedFileFormat:
            createImprovedCvVersionDto.generatedFileFormat ?? null,
          isCurrent: true,
          createdByProcess:
            createImprovedCvVersionDto.createdByProcess ?? CreatedByProcess.AI,
        }),
      );

      await cvRepository.update(sourceCv.id, {
        currentVersionId: newVersion.id,
        targetRole: createImprovedCvVersionDto.targetRole.trim(),
        sourceType:
          sourceCv.sourceType === CvSourceType.CREATED
            ? CvSourceType.MIXED
            : sourceCv.sourceType,
      });

      if (sourceVersion.personalDetail) {
        await cvPersonalDetailsRepository.save(
          cvPersonalDetailsRepository.create({
            cvVersionId: newVersion.id,
            fullName: sourceVersion.personalDetail.fullName,
            email: sourceVersion.personalDetail.email,
            phone: sourceVersion.personalDetail.phone,
            location: sourceVersion.personalDetail.location,
            professionalSummary:
              sourceVersion.personalDetail.professionalSummary,
          }),
        );
      }

      if (sourceVersion.workExperiences.length) {
        await cvWorkExperiencesRepository.save(
          sourceVersion.workExperiences.map((workExperience) =>
            cvWorkExperiencesRepository.create({
              cvVersionId: newVersion.id,
              companyName: workExperience.companyName,
              jobTitle: workExperience.jobTitle,
              periodLabel: workExperience.periodLabel,
              startDate: workExperience.startDate,
              endDate: workExperience.endDate,
              isCurrent: workExperience.isCurrent,
              description: workExperience.description,
              displayOrder: workExperience.displayOrder,
            }),
          ),
        );
      }

      if (sourceVersion.educationEntries.length) {
        await cvEducationEntriesRepository.save(
          sourceVersion.educationEntries.map((educationEntry) =>
            cvEducationEntriesRepository.create({
              cvVersionId: newVersion.id,
              institutionName: educationEntry.institutionName,
              degreeTitle: educationEntry.degreeTitle,
              periodLabel: educationEntry.periodLabel,
              startDate: educationEntry.startDate,
              endDate: educationEntry.endDate,
              displayOrder: educationEntry.displayOrder,
            }),
          ),
        );
      }

      if (createImprovedCvVersionDto.skills?.length) {
        await this.attachSkillsToVersion(
          newVersion.id,
          createImprovedCvVersionDto.skills,
          skillsRepository,
          cvVersionSkillsRepository,
        );
      } else if (sourceVersion.versionSkills.length) {
        await cvVersionSkillsRepository.save(
          sourceVersion.versionSkills.map((versionSkill) =>
            cvVersionSkillsRepository.create({
              cvVersionId: newVersion.id,
              skillId: versionSkill.skillId,
              displayOrder: versionSkill.displayOrder,
            }),
          ),
        );
      }

      if (createImprovedCvVersionDto.improvementRequestId) {
        await improvementRequestsRepository.update(
          {
            id: createImprovedCvVersionDto.improvementRequestId,
            userId,
          },
          {
            status: CvImprovementRequestStatus.COMPLETED,
            resultCvVersionId: newVersion.id,
            errorMessage: null,
          },
        );
      }
    });

    return this.getCv(userId, cvId);
  }

  async createManualEditedVersion(
    userId: string,
    cvId: string,
    updateManualCvVersionDto: UpdateManualCvVersionDto,
  ) {
    const sourceCv = await this.findCvOrFail(userId, cvId);
    const sourceVersion = sourceCv.currentVersion ?? sourceCv.versions[0];

    if (!sourceVersion) {
      throw new NotFoundException('Current CV version not found');
    }

    await this.dataSource.transaction(async (manager) => {
      const cvRepository = manager.getRepository(Cv);
      const cvVersionRepository = manager.getRepository(CvVersion);
      const cvPersonalDetailsRepository = manager.getRepository(CvPersonalDetail);
      const cvWorkExperiencesRepository = manager.getRepository(CvWorkExperience);
      const cvEducationEntriesRepository = manager.getRepository(CvEducationEntry);
      const skillsRepository = manager.getRepository(Skill);
      const cvVersionSkillsRepository = manager.getRepository(CvVersionSkill);

      await cvVersionRepository.update(
        { cvId: sourceCv.id, isCurrent: true },
        { isCurrent: false },
      );

      const latestVersion = await cvVersionRepository.findOne({
        where: { cvId: sourceCv.id },
        order: { versionNumber: 'DESC' },
      });

      const nextVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;

      const nextTargetRole =
        updateManualCvVersionDto.targetRole?.trim() ?? sourceVersion.targetRole;

      const nextSummaryText =
        updateManualCvVersionDto.summaryText?.trim() ?? sourceVersion.summaryText;

      const nextSkillsText =
        updateManualCvVersionDto.skillsText?.trim() ??
        this.stringifySkillList(updateManualCvVersionDto.skills) ??
        sourceVersion.skillsText;

      const newVersion = await cvVersionRepository.save(
        cvVersionRepository.create({
          cvId: sourceCv.id,
          versionNumber: nextVersionNumber,
          versionType: CvVersionType.MANUAL_EDIT,
          targetRole: nextTargetRole,
          jobDescription:
            updateManualCvVersionDto.jobDescription?.trim() ??
            sourceVersion.jobDescription,
          summaryText: nextSummaryText,
          skillsText: nextSkillsText,
          stylePreset:
            updateManualCvVersionDto.stylePreset ??
            sourceVersion.stylePreset ??
            CvStylePreset.ATS,
          generatedFileUrl: null,
          generatedFileFormat: null,
          isCurrent: true,
          createdByProcess: CreatedByProcess.MANUAL,
        }),
      );

      await cvRepository.update(sourceCv.id, {
        title: updateManualCvVersionDto.title?.trim() ?? sourceCv.title,
        currentVersionId: newVersion.id,
        targetRole: nextTargetRole,
        sourceType:
          sourceCv.sourceType === CvSourceType.IMPROVED
            ? CvSourceType.MIXED
            : sourceCv.sourceType,
      });

      const sourcePersonalDetail = sourceVersion.personalDetail;

      await cvPersonalDetailsRepository.save(
        cvPersonalDetailsRepository.create({
          cvVersionId: newVersion.id,
          fullName:
            updateManualCvVersionDto.personalDetails?.fullName?.trim() ??
            sourcePersonalDetail?.fullName ??
            '',
          email:
            updateManualCvVersionDto.personalDetails?.email?.trim().toLowerCase() ??
            sourcePersonalDetail?.email ??
            '',
          phone:
            updateManualCvVersionDto.personalDetails?.phone?.trim() ??
            sourcePersonalDetail?.phone ??
            null,
          location:
            updateManualCvVersionDto.personalDetails?.location?.trim() ??
            sourcePersonalDetail?.location ??
            null,
          professionalSummary:
            updateManualCvVersionDto.personalDetails?.professionalSummary?.trim() ??
            sourcePersonalDetail?.professionalSummary ??
            null,
        }),
      );

      if (updateManualCvVersionDto.workExperiences) {
        if (updateManualCvVersionDto.workExperiences.length) {
          await cvWorkExperiencesRepository.save(
            updateManualCvVersionDto.workExperiences.map((workExperience, index) =>
              cvWorkExperiencesRepository.create({
                cvVersionId: newVersion.id,
                companyName: workExperience.companyName.trim(),
                jobTitle: workExperience.jobTitle.trim(),
                periodLabel: workExperience.periodLabel.trim(),
                startDate: workExperience.startDate?.trim() ?? null,
                endDate: workExperience.endDate?.trim() ?? null,
                isCurrent: workExperience.isCurrent ?? false,
                description: workExperience.description?.trim() ?? null,
                displayOrder: index + 1,
              }),
            ),
          );
        }
      } else if (sourceVersion.workExperiences.length) {
        await cvWorkExperiencesRepository.save(
          sourceVersion.workExperiences.map((workExperience) =>
            cvWorkExperiencesRepository.create({
              cvVersionId: newVersion.id,
              companyName: workExperience.companyName,
              jobTitle: workExperience.jobTitle,
              periodLabel: workExperience.periodLabel,
              startDate: workExperience.startDate,
              endDate: workExperience.endDate,
              isCurrent: workExperience.isCurrent,
              description: workExperience.description,
              displayOrder: workExperience.displayOrder,
            }),
          ),
        );
      }

      if (updateManualCvVersionDto.educationEntries) {
        if (updateManualCvVersionDto.educationEntries.length) {
          await cvEducationEntriesRepository.save(
            updateManualCvVersionDto.educationEntries.map((educationEntry, index) =>
              cvEducationEntriesRepository.create({
                cvVersionId: newVersion.id,
                institutionName: educationEntry.institutionName.trim(),
                degreeTitle: educationEntry.degreeTitle.trim(),
                periodLabel: educationEntry.periodLabel.trim(),
                startDate: educationEntry.startDate?.trim() ?? null,
                endDate: educationEntry.endDate?.trim() ?? null,
                displayOrder: index + 1,
              }),
            ),
          );
        }
      } else if (sourceVersion.educationEntries.length) {
        await cvEducationEntriesRepository.save(
          sourceVersion.educationEntries.map((educationEntry) =>
            cvEducationEntriesRepository.create({
              cvVersionId: newVersion.id,
              institutionName: educationEntry.institutionName,
              degreeTitle: educationEntry.degreeTitle,
              periodLabel: educationEntry.periodLabel,
              startDate: educationEntry.startDate,
              endDate: educationEntry.endDate,
              displayOrder: educationEntry.displayOrder,
            }),
          ),
        );
      }

      if (updateManualCvVersionDto.skills) {
        await this.attachSkillsToVersion(
          newVersion.id,
          updateManualCvVersionDto.skills,
          skillsRepository,
          cvVersionSkillsRepository,
        );
      } else if (sourceVersion.versionSkills.length) {
        await cvVersionSkillsRepository.save(
          sourceVersion.versionSkills.map((versionSkill) =>
            cvVersionSkillsRepository.create({
              cvVersionId: newVersion.id,
              skillId: versionSkill.skillId,
              displayOrder: versionSkill.displayOrder,
            }),
          ),
        );
      }
    });

    return this.getCv(userId, cvId);
  }

  private async findCvOrFail(userId: string, cvId: string) {
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
      throw new NotFoundException('CV not found');
    }

    cv.versions = [...cv.versions].sort(
      (left, right) => right.versionNumber - left.versionNumber,
    );

    for (const version of cv.versions) {
      version.workExperiences = [...version.workExperiences].sort(
        (left, right) => left.displayOrder - right.displayOrder,
      );
      version.educationEntries = [...version.educationEntries].sort(
        (left, right) => left.displayOrder - right.displayOrder,
      );
      version.versionSkills = [...version.versionSkills].sort(
        (left, right) => left.displayOrder - right.displayOrder,
      );
    }

    return cv;
  }

  private async attachSkillsToVersion(
    cvVersionId: string,
    skills: string[] | undefined,
    skillsRepository: Repository<Skill>,
    cvVersionSkillsRepository: Repository<CvVersionSkill>,
  ) {
    const normalizedSkills = this.normalizeSkills(skills);

    if (!normalizedSkills.length) {
      return;
    }

    for (const [index, skillName] of normalizedSkills.entries()) {
      const normalizedName = this.normalizeSkillName(skillName);
      let skill = await skillsRepository.findOne({
        where: { normalizedName },
      });

      skill ??= await skillsRepository.save(
        skillsRepository.create({
          name: skillName,
          normalizedName,
          category: null,
        }),
      );

      await cvVersionSkillsRepository.save(
        cvVersionSkillsRepository.create({
          cvVersionId,
          skillId: skill.id,
          displayOrder: index + 1,
        }),
      );
    }
  }

  private normalizeSkills(skills: string[] | undefined) {
    return [...new Set((skills ?? []).map((skill) => skill.trim()).filter(Boolean))];
  }

  private normalizeSkillName(skill: string) {
    return skill.trim().toLowerCase().replaceAll(/\s+/g, ' ');
  }

  private stringifySkillList(skills: string[] | undefined) {
    const normalizedSkills = this.normalizeSkills(skills);
    return normalizedSkills.length ? normalizedSkills.join(', ') : null;
  }

  private toCvListItem(cv: Cv) {
    const versionCount = Number(
      (cv as Cv & { versionsCount?: number }).versionsCount ?? cv.versions?.length ?? 0,
    );

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

  private toCvResponse(cv: Cv) {
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

  private toCvVersionSummary(version: CvVersion) {
    return {
      id: version.id,
      cvId: version.cvId,
      versionNumber: version.versionNumber,
      versionType: version.versionType,
      targetRole: version.targetRole,
      stylePreset: version.stylePreset,
      isCurrent: version.isCurrent,
      createdByProcess: version.createdByProcess,
      generatedFileUrl: version.generatedFileUrl,
      generatedFileFormat: version.generatedFileFormat,
      createdAt: version.createdAt,
      updatedAt: version.updatedAt,
    };
  }

  private toCvVersionDetail(version: CvVersion) {
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
}