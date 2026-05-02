import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, {
  APIConnectionError,
  APIConnectionTimeoutError,
  APIError,
  RateLimitError,
} from 'openai';
import {
  CreateCvEducationEntryDto,
  CreateCvWorkExperienceDto,
} from '../dto/create-cv.dto';
import { GenerateCvFromFormDto } from '../dto/generate-cv-from-form.dto';
import { CvPromptBuilderService } from './cv-prompt-builder.service';

export interface GeneratedCvContent {
  targetRole: string;
  summaryText: string;
  skills: string[];
  skillsText: string | null;
  workExperiences: CreateCvWorkExperienceDto[];
  educationEntries: CreateCvEducationEntryDto[];
}

export interface ExtractedDocumentCvContent {
  title: string | null;
  extractedTargetRole: string | null;
  personalDetails: {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    professionalSummary: string | null;
  };
  workExperiences: Array<{
    companyName: string;
    jobTitle: string;
    periodLabel: string;
    description: string | null;
  }>;
  educationEntries: Array<{
    institutionName: string;
    degreeTitle: string;
    periodLabel: string;
  }>;
  skills: string[];
  skillsText: string | null;
}

export interface ImprovedDocumentCvContent {
  targetRole: string;
  summaryText: string;
  skills: string[];
  skillsText: string | null;
}

export interface GeneratedDocumentImprovementContent {
  extracted: ExtractedDocumentCvContent;
  improved: ImprovedDocumentCvContent;
}

interface GenerateFromUploadedDocumentInput {
  originalFileName: string;
  targetRole: string;
  jobDescription?: string | null;
  extractedText: string;
}

interface LlmProviderConfig {
  providerName: string;
  apiKey: string;
  apiKeyHint: string;
  baseURL?: string;
  model: string;
}

@Injectable()
export class OpenAiCvGeneratorService {
  private readonly logger = new Logger(OpenAiCvGeneratorService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly cvPromptBuilderService: CvPromptBuilderService,
  ) {}

  async generateFromForm(
    generateCvFromFormDto: GenerateCvFromFormDto,
  ): Promise<GeneratedCvContent> {
    const providerConfig = this.getProviderConfig();
    const client = this.createClient(providerConfig);

    try {
      const completion = await client.chat.completions.create({
        model: providerConfig.model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: this.cvPromptBuilderService.buildSystemPrompt(),
          },
          {
            role: 'user',
            content: this.cvPromptBuilderService.buildUserPrompt(
              generateCvFromFormDto,
            ),
          },
        ],
      });

      return this.parseGeneratedContent(
        completion.choices[0]?.message?.content,
        generateCvFromFormDto,
      );
    } catch (error) {
      this.handleProviderError(error, providerConfig);
    }
  }

  async generateFromUploadedDocument(
    input: GenerateFromUploadedDocumentInput,
  ): Promise<GeneratedDocumentImprovementContent> {
    const providerConfig = this.getProviderConfig();
    const client = this.createClient(providerConfig);

    try {
      const completion = await client.chat.completions.create({
        model: providerConfig.model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: this.cvPromptBuilderService.buildUploadedDocumentSystemPrompt(),
          },
          {
            role: 'user',
            content: this.cvPromptBuilderService.buildUploadedDocumentUserPrompt(
              input,
            ),
          },
        ],
      });

      return this.parseUploadedDocumentContent(
        completion.choices[0]?.message?.content,
        input,
      );
    } catch (error) {
      this.handleProviderError(error, providerConfig);
    }
  }

  private createClient(providerConfig: LlmProviderConfig) {
    return new OpenAI({
      apiKey: providerConfig.apiKey,
      ...(providerConfig.baseURL
        ? { baseURL: providerConfig.baseURL }
        : {}),
    });
  }

  private getProviderConfig(): LlmProviderConfig {
    const providerId =
      this.readConfigValue('LLM_PROVIDER')?.toLowerCase() ||
      this.inferProviderId();

    if (providerId === 'gemini') {
      return {
        providerName: 'Gemini',
        apiKey: this.readRequiredConfig(
          ['LLM_API_KEY', 'GEMINI_API_KEY'],
          'LLM_API_KEY or GEMINI_API_KEY',
        ),
        apiKeyHint: 'LLM_API_KEY or GEMINI_API_KEY',
        baseURL:
          this.readConfigValue('LLM_BASE_URL') ||
          this.readConfigValue('GEMINI_BASE_URL') ||
          'https://generativelanguage.googleapis.com/v1beta/openai/',
        model:
          this.readConfigValue('LLM_MODEL') ||
          this.readConfigValue('GEMINI_MODEL') ||
          'gemini-2.5-flash',
      };
    }

    if (providerId === 'openai') {
      return {
        providerName: 'OpenAI',
        apiKey: this.readRequiredConfig(
          ['LLM_API_KEY', 'OPENAI_API_KEY'],
          'LLM_API_KEY or OPENAI_API_KEY',
        ),
        apiKeyHint: 'LLM_API_KEY or OPENAI_API_KEY',
        baseURL:
          this.readConfigValue('LLM_BASE_URL') ||
          this.readConfigValue('OPENAI_BASE_URL') ||
          undefined,
        model:
          this.readConfigValue('LLM_MODEL') ||
          this.readConfigValue('OPENAI_MODEL') ||
          'gpt-4.1-mini',
      };
    }

    const providerName = this.formatProviderName(providerId);
    const baseURL = this.readConfigValue('LLM_BASE_URL');

    if (!baseURL) {
      throw new ServiceUnavailableException(
        `LLM_BASE_URL is not configured for provider ${providerName}`,
      );
    }

    return {
      providerName,
      apiKey: this.readRequiredConfig(['LLM_API_KEY'], 'LLM_API_KEY'),
      apiKeyHint: 'LLM_API_KEY',
      baseURL,
      model: this.readConfigValue('LLM_MODEL') || 'gemini-2.5-flash',
    };
  }

  private inferProviderId() {
    if (this.readConfigValue('GEMINI_API_KEY')) {
      return 'gemini';
    }

    if (this.readConfigValue('OPENAI_API_KEY')) {
      return 'openai';
    }

    return 'gemini';
  }

  private readConfigValue(key: string) {
    const value = this.configService.get<string>(key)?.trim();
    return value?.length ? value : null;
  }

  private readRequiredConfig(keys: string[], hint: string) {
    for (const key of keys) {
      const value = this.readConfigValue(key);

      if (value) {
        return value;
      }
    }

    throw new ServiceUnavailableException(`${hint} is not configured`);
  }

  private formatProviderName(providerId: string) {
    if (!providerId.length) {
      return 'configured LLM provider';
    }

    return providerId.charAt(0).toUpperCase() + providerId.slice(1);
  }

  private parseGeneratedContent(
    rawContent: string | null | undefined,
    generateCvFromFormDto: GenerateCvFromFormDto,
  ): GeneratedCvContent {
    const parsedContent = this.parseJsonPayload(rawContent);

    const targetRole =
      this.readString(parsedContent, 'targetRole') ||
      generateCvFromFormDto.targetRole;

    const summaryText =
      this.readString(parsedContent, 'summaryText') ||
      generateCvFromFormDto.personalDetails.professionalSummary?.trim() ||
      null;

    if (!summaryText) {
      throw new ServiceUnavailableException(
        'LLM response did not include summaryText',
      );
    }

    const generatedSkills = this.readStringArray(parsedContent, 'skills');
    const fallbackSkills = this.normalizeSkills([
      ...(generateCvFromFormDto.skills ?? []),
      ...this.splitSkillsText(generateCvFromFormDto.skillsText),
    ]);
    const skills = generatedSkills.length ? generatedSkills : fallbackSkills;
    const skillsText =
      this.readString(parsedContent, 'skillsText') ||
      (skills.length ? skills.join(', ') : null);
    const workExperiences = this.mergeGeneratedWorkExperiences(
      parsedContent,
      generateCvFromFormDto.workExperiences ?? [],
    );
    const educationEntries = this.mergeGeneratedEducationEntries(
      parsedContent,
      generateCvFromFormDto.educationEntries ?? [],
    );

    return {
      targetRole,
      summaryText,
      skills,
      skillsText,
      workExperiences,
      educationEntries,
    };
  }

  private mergeGeneratedWorkExperiences(
    payload: unknown,
    sourceWorkExperiences: CreateCvWorkExperienceDto[],
  ) {
    const generatedEntries = this.readObjectArray(payload, 'workExperiences');

    return sourceWorkExperiences.map((workExperience, index) => {
      const generatedEntry = generatedEntries[index] ?? {};
      const normalizedDescription =
        this.readString(generatedEntry, 'description') ??
        workExperience.description?.trim() ??
        undefined;

      return {
        companyName:
          this.readString(generatedEntry, 'companyName') ??
          workExperience.companyName.trim(),
        jobTitle:
          this.readString(generatedEntry, 'jobTitle') ??
          workExperience.jobTitle.trim(),
        periodLabel:
          this.readString(generatedEntry, 'periodLabel') ??
          workExperience.periodLabel.trim(),
        startDate:
          this.readString(generatedEntry, 'startDate') ??
          workExperience.startDate?.trim(),
        endDate:
          this.readString(generatedEntry, 'endDate') ??
          workExperience.endDate?.trim(),
        isCurrent:
          this.readBoolean(generatedEntry, 'isCurrent') ??
          workExperience.isCurrent ??
          false,
        ...(normalizedDescription
          ? { description: normalizedDescription }
          : {}),
      };
    });
  }

  private mergeGeneratedEducationEntries(
    payload: unknown,
    sourceEducationEntries: CreateCvEducationEntryDto[],
  ) {
    const generatedEntries = this.readObjectArray(payload, 'educationEntries');

    return sourceEducationEntries.map((educationEntry, index) => {
      const generatedEntry = generatedEntries[index] ?? {};

      return {
        institutionName:
          this.readString(generatedEntry, 'institutionName') ??
          educationEntry.institutionName.trim(),
        degreeTitle:
          this.readString(generatedEntry, 'degreeTitle') ??
          educationEntry.degreeTitle.trim(),
        periodLabel:
          this.readString(generatedEntry, 'periodLabel') ??
          educationEntry.periodLabel.trim(),
        startDate:
          this.readString(generatedEntry, 'startDate') ??
          educationEntry.startDate?.trim(),
        endDate:
          this.readString(generatedEntry, 'endDate') ??
          educationEntry.endDate?.trim(),
      };
    });
  }

  private parseUploadedDocumentContent(
    rawContent: string | null | undefined,
    input: GenerateFromUploadedDocumentInput,
  ): GeneratedDocumentImprovementContent {
    const parsedContent = this.parseJsonPayload(rawContent);
    const extractedPersonalDetails = this.readObject(
      parsedContent,
      'personalDetails',
    );
    const extractedSkills = this.readStringArray(parsedContent, 'skills');
    const improvedSkills = this.readStringArray(parsedContent, 'improvedSkills');

    return {
      extracted: {
        title: this.readString(parsedContent, 'title'),
        extractedTargetRole: this.readString(parsedContent, 'extractedTargetRole'),
        personalDetails: {
          fullName: this.readString(extractedPersonalDetails, 'fullName'),
          email: this.readString(extractedPersonalDetails, 'email'),
          phone: this.readString(extractedPersonalDetails, 'phone'),
          location: this.readString(extractedPersonalDetails, 'location'),
          professionalSummary: this.readString(
            extractedPersonalDetails,
            'professionalSummary',
          ),
        },
        workExperiences: this.readObjectArray(parsedContent, 'workExperiences')
          .map((entry) => ({
            companyName: this.readString(entry, 'companyName'),
            jobTitle: this.readString(entry, 'jobTitle'),
            periodLabel: this.readString(entry, 'periodLabel'),
            description: this.readString(entry, 'description'),
          }))
          .filter(
            (entry): entry is {
              companyName: string;
              jobTitle: string;
              periodLabel: string;
              description: string | null;
            } =>
              Boolean(entry.companyName) &&
              Boolean(entry.jobTitle) &&
              Boolean(entry.periodLabel),
          ),
        educationEntries: this.readObjectArray(parsedContent, 'educationEntries')
          .map((entry) => ({
            institutionName: this.readString(entry, 'institutionName'),
            degreeTitle: this.readString(entry, 'degreeTitle'),
            periodLabel: this.readString(entry, 'periodLabel'),
          }))
          .filter(
            (entry): entry is {
              institutionName: string;
              degreeTitle: string;
              periodLabel: string;
            } =>
              Boolean(entry.institutionName) &&
              Boolean(entry.degreeTitle) &&
              Boolean(entry.periodLabel),
          ),
        skills: extractedSkills,
        skillsText:
          this.readString(parsedContent, 'skillsText') ||
          (extractedSkills.length ? extractedSkills.join(', ') : null),
      },
      improved: {
        targetRole:
          this.readString(parsedContent, 'improvedTargetRole') || input.targetRole,
        summaryText:
          this.readString(parsedContent, 'improvedSummaryText') ||
          this.readString(parsedContent, 'summaryText') ||
          this.readString(extractedPersonalDetails, 'professionalSummary') ||
          'Perfil profesional pendiente de completar.',
        skills: improvedSkills.length ? improvedSkills : extractedSkills,
        skillsText:
          this.readString(parsedContent, 'improvedSkillsText') ||
          (improvedSkills.length
            ? improvedSkills.join(', ')
            : extractedSkills.length
              ? extractedSkills.join(', ')
              : null),
      },
    };
  }

  private parseJsonPayload(rawContent: string | null | undefined) {
    if (!rawContent?.trim()) {
      throw new ServiceUnavailableException('LLM returned an empty response');
    }

    let parsedContent: unknown;

    try {
      parsedContent = JSON.parse(rawContent);
    } catch {
      throw new ServiceUnavailableException('LLM returned invalid JSON');
    }

    if (
      !parsedContent ||
      typeof parsedContent !== 'object' ||
      Array.isArray(parsedContent)
    ) {
      throw new ServiceUnavailableException(
        'LLM returned an unexpected payload',
      );
    }

    return parsedContent;
  }

  private readObject(payload: unknown, key: string) {
    const candidate = (payload as Record<string, unknown>)[key];

    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
      return {};
    }

    return candidate;
  }

  private readObjectArray(payload: unknown, key: string) {
    const candidate = (payload as Record<string, unknown>)[key];

    if (!Array.isArray(candidate)) {
      return [];
    }

    return candidate.filter(
      (entry): entry is Record<string, unknown> =>
        Boolean(entry) && typeof entry === 'object' && !Array.isArray(entry),
    );
  }

  private readString(payload: unknown, key: string) {
    const candidate = (payload as Record<string, unknown>)[key];

    if (typeof candidate !== 'string') {
      return null;
    }

    const normalizedCandidate = candidate.trim();
    return normalizedCandidate.length ? normalizedCandidate : null;
  }

  private readBoolean(payload: unknown, key: string) {
    const candidate = (payload as Record<string, unknown>)[key];
    return typeof candidate === 'boolean' ? candidate : null;
  }

  private readStringArray(payload: unknown, key: string) {
    const candidate = (payload as Record<string, unknown>)[key];

    if (!Array.isArray(candidate)) {
      return [];
    }

    return this.normalizeSkills(
      candidate.filter((value): value is string => typeof value === 'string'),
    );
  }

  private splitSkillsText(skillsText: string | undefined) {
    return (skillsText ?? '')
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  private normalizeSkills(skills: string[]) {
    return [...new Set(skills.map((skill) => skill.trim()).filter(Boolean))];
  }

  private handleProviderError(
    error: unknown,
    providerConfig: LlmProviderConfig,
  ): never {
    const providerName = providerConfig.providerName;

    if (error instanceof RateLimitError) {
      const requestIdSuffix = error.requestID
        ? ` requestId=${error.requestID}`
        : '';

      if (error.code === 'insufficient_quota' || error.type === 'insufficient_quota') {
        this.logger.warn(`${providerName} quota exceeded.${requestIdSuffix}`);
        throw new ServiceUnavailableException(
          `${providerName} quota exceeded for the configured API key. Check billing/quota or replace ${providerConfig.apiKeyHint}.`,
        );
      }

      this.logger.warn(`${providerName} rate limit reached.${requestIdSuffix}`);
      throw new HttpException(
        `${providerName} rate limit reached. Retry in a few moments.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (
      error instanceof APIConnectionTimeoutError ||
      error instanceof APIConnectionError
    ) {
      this.logger.error(`${providerName} connection failed.`, error);
      throw new ServiceUnavailableException(
        `Could not reach ${providerName}. Retry in a few moments.`,
      );
    }

    if (error instanceof APIError) {
      this.logger.error(
        `${providerName} request failed with status ${error.status ?? 'unknown'}.`,
      );
      throw new ServiceUnavailableException(
        `${providerName} request failed. Check the configured API key and try again.`,
      );
    }

    throw error;
  }
}