import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CvImprovementRequestStatus } from '../common/enums/database.enums';
import { ImprovementsService } from './improvements.service';
import { CvImprovementRequest } from './entities/cv-improvement-request.entity';

describe('ImprovementsService', () => {
  let service: ImprovementsService;
  let processImprovementRequest: jest.Mock;
  let findOne: jest.Mock;
  let save: jest.Mock;

  const buildRequest = (
    overrides: Partial<CvImprovementRequest> = {},
  ): CvImprovementRequest =>
    ({
      id: '10',
      userId: '5',
      cvId: null,
      uploadedFileId: '20',
      targetRole: 'Frontend Engineer',
      jobDescription: null,
      status: CvImprovementRequestStatus.PENDING,
      errorMessage: null,
      resultCvVersionId: null,
      uploadedFile: {
        id: '20',
        originalName: 'cv-frontend.pdf',
        storagePath: 'uploads/cv-frontend.pdf',
        fileExtension: 'pdf',
      },
      ...overrides,
    }) as CvImprovementRequest;

  beforeEach(() => {
    processImprovementRequest = jest.fn();
    findOne = jest.fn();
    save = jest.fn();

    service = new ImprovementsService(
      {
        processImprovementRequest,
      } as never,
      {
        findOne,
        save,
      } as never,
      {} as never,
      {} as never,
      {} as never,
    );
  });

  it('throws when the improvement request does not exist', async () => {
    findOne.mockResolvedValue(null);

    await expect(service.processRequest('5', '999')).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(save).not.toHaveBeenCalled();
    expect(processImprovementRequest).not.toHaveBeenCalled();
  });

  it('prevents processing a request that is already processing', async () => {
    findOne.mockResolvedValue(
      buildRequest({ status: CvImprovementRequestStatus.PROCESSING }),
    );

    await expect(service.processRequest('5', '10')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(save).not.toHaveBeenCalled();
    expect(processImprovementRequest).not.toHaveBeenCalled();
  });

  it('prevents processing a request that is already completed', async () => {
    findOne.mockResolvedValue(
      buildRequest({ status: CvImprovementRequestStatus.COMPLETED }),
    );

    await expect(service.processRequest('5', '10')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(save).not.toHaveBeenCalled();
    expect(processImprovementRequest).not.toHaveBeenCalled();
  });

  it('marks the request as processing and returns the generated CV on success', async () => {
    const request = buildRequest();
    const savedStates: Array<{
      status: CvImprovementRequestStatus;
      errorMessage: string | null;
    }> = [];
    const createdCv = { id: '300', targetRole: 'Senior Frontend Engineer' };

    findOne.mockResolvedValue(request);
    save.mockImplementation(async (value: CvImprovementRequest) => {
      savedStates.push({
        status: value.status,
        errorMessage: value.errorMessage,
      });
      return value;
    });
    processImprovementRequest.mockResolvedValue(createdCv);

    await expect(service.processRequest('5', '10')).resolves.toEqual(createdCv);

    expect(processImprovementRequest).toHaveBeenCalledWith('5', request);
    expect(savedStates).toEqual([
      {
        status: CvImprovementRequestStatus.PROCESSING,
        errorMessage: null,
      },
    ]);
  });

  it('marks the request as failed when the workflow throws', async () => {
    const request = buildRequest();
    const savedStates: Array<{
      status: CvImprovementRequestStatus;
      errorMessage: string | null;
    }> = [];
    const processingError = new Error('OpenAI unavailable');

    findOne.mockResolvedValue(request);
    save.mockImplementation(async (value: CvImprovementRequest) => {
      savedStates.push({
        status: value.status,
        errorMessage: value.errorMessage,
      });
      return value;
    });
    processImprovementRequest.mockRejectedValue(processingError);

    await expect(service.processRequest('5', '10')).rejects.toThrow(
      'OpenAI unavailable',
    );

    expect(savedStates).toEqual([
      {
        status: CvImprovementRequestStatus.PROCESSING,
        errorMessage: null,
      },
      {
        status: CvImprovementRequestStatus.FAILED,
        errorMessage: 'OpenAI unavailable',
      },
    ]);
  });
});