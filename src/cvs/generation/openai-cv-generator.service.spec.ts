import {
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  APIConnectionError,
  APIError,
  RateLimitError,
} from 'openai';
import { ConfigService } from '@nestjs/config';
import { CvPromptBuilderService } from './cv-prompt-builder.service';
import { OpenAiCvGeneratorService } from './openai-cv-generator.service';

const openAiProviderConfig = {
  providerName: 'OpenAI',
  apiKey: 'test-key',
  apiKeyHint: 'LLM_API_KEY or OPENAI_API_KEY',
  model: 'gpt-4.1-mini',
};

describe('OpenAiCvGeneratorService', () => {
  let service: OpenAiCvGeneratorService;

  beforeEach(() => {
    service = new OpenAiCvGeneratorService(
      {} as ConfigService,
      {} as CvPromptBuilderService,
    );
  });

  it('maps insufficient quota errors to a service unavailable message', () => {
    const error = new RateLimitError(
      429,
      {
        message: 'Quota exceeded',
        type: 'insufficient_quota',
        code: 'insufficient_quota',
      },
      'Quota exceeded',
      new Headers({ 'x-request-id': 'req_123' }),
    );

    expect(() =>
      (service as unknown as {
        handleProviderError(
          error: unknown,
          providerConfig: typeof openAiProviderConfig,
        ): never;
      }).handleProviderError(error, openAiProviderConfig),
    ).toThrow(ServiceUnavailableException);

    expect(() =>
      (service as unknown as {
        handleProviderError(
          error: unknown,
          providerConfig: typeof openAiProviderConfig,
        ): never;
      }).handleProviderError(error, openAiProviderConfig),
    ).toThrow(
      'OpenAI quota exceeded for the configured API key. Check billing/quota or replace LLM_API_KEY or OPENAI_API_KEY.',
    );
  });

  it('maps non-quota rate limits to too many requests', () => {
    const error = new RateLimitError(
      429,
      {
        message: 'Too many requests',
        type: 'rate_limit_exceeded',
        code: 'rate_limit_exceeded',
      },
      'Too many requests',
      new Headers(),
    );

    expect(() =>
      (service as unknown as {
        handleProviderError(
          error: unknown,
          providerConfig: typeof openAiProviderConfig,
        ): never;
      }).handleProviderError(error, openAiProviderConfig),
    ).toThrow(HttpException);

    try {
      (service as unknown as {
        handleProviderError(
          error: unknown,
          providerConfig: typeof openAiProviderConfig,
        ): never;
      }).handleProviderError(error, openAiProviderConfig);
    } catch (caughtError) {
      expect((caughtError as HttpException).getStatus()).toBe(
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  });

  it('maps connection errors to service unavailable', () => {
    const error = new APIConnectionError({ message: 'Connection error.' });

    expect(() =>
      (service as unknown as {
        handleProviderError(
          error: unknown,
          providerConfig: typeof openAiProviderConfig,
        ): never;
      }).handleProviderError(error, openAiProviderConfig),
    ).toThrow(ServiceUnavailableException);
  });

  it('maps generic OpenAI API errors to service unavailable', () => {
    const error = new APIError(
      500,
      {
        message: 'OpenAI internal error',
      },
      'OpenAI internal error',
      new Headers(),
    );

    expect(() =>
      (service as unknown as {
        handleProviderError(
          error: unknown,
          providerConfig: typeof openAiProviderConfig,
        ): never;
      }).handleProviderError(error, openAiProviderConfig),
    ).toThrow(ServiceUnavailableException);
  });

  it('infers Gemini settings from GEMINI_* variables', () => {
    const configValues = {
      GEMINI_API_KEY: 'gemini-key',
      GEMINI_MODEL: 'gemini-2.5-flash-lite',
    };

    service = new OpenAiCvGeneratorService(
      {
        get: (key: string) => configValues[key as keyof typeof configValues],
      } as ConfigService,
      {} as CvPromptBuilderService,
    );

    expect(
      (service as unknown as {
        getProviderConfig(): {
          providerName: string;
          apiKey: string;
          baseURL?: string;
          model: string;
        };
      }).getProviderConfig(),
    ).toEqual({
      providerName: 'Gemini',
      apiKey: 'gemini-key',
      apiKeyHint: 'LLM_API_KEY or GEMINI_API_KEY',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      model: 'gemini-2.5-flash-lite',
    });
  });
});