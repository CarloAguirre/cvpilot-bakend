import { Test, TestingModule } from '@nestjs/testing';
import { ImprovementsController } from './improvements.controller';
import { ImprovementsService } from './improvements.service';

describe('ImprovementsController', () => {
  let controller: ImprovementsController;
  let improvementsService: {
    listRequests: jest.Mock;
    createRequest: jest.Mock;
    processRequest: jest.Mock;
    updateRequest: jest.Mock;
  };

  beforeEach(async () => {
    improvementsService = {
      listRequests: jest.fn(),
      createRequest: jest.fn(),
      processRequest: jest.fn(),
      updateRequest: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImprovementsController],
      providers: [
        {
          provide: ImprovementsService,
          useValue: improvementsService,
        },
      ],
    }).compile();

    controller = module.get<ImprovementsController>(ImprovementsController);
  });

  it('lists improvement requests for the current user', async () => {
    improvementsService.listRequests.mockResolvedValue([{ id: '10' }]);

    await expect(controller.listRequests('5')).resolves.toEqual([{ id: '10' }]);
    expect(improvementsService.listRequests).toHaveBeenCalledWith('5');
  });

  it('creates an improvement request for the current user', async () => {
    const payload = {
      uploadedFileId: '20',
      targetRole: 'Frontend Engineer',
      jobDescription: 'React y TypeScript',
    };

    improvementsService.createRequest.mockResolvedValue({ id: '11' });

    await expect(controller.createRequest('5', payload)).resolves.toEqual({
      id: '11',
    });
    expect(improvementsService.createRequest).toHaveBeenCalledWith('5', payload);
  });

  it('processes an improvement request for the current user', async () => {
    improvementsService.processRequest.mockResolvedValue({ id: '300' });

    await expect(controller.processRequest('5', '10')).resolves.toEqual({
      id: '300',
    });
    expect(improvementsService.processRequest).toHaveBeenCalledWith('5', '10');
  });

  it('updates an improvement request for the current user', async () => {
    const payload = {
      status: 'failed' as const,
      errorMessage: 'OpenAI unavailable',
    };

    improvementsService.updateRequest.mockResolvedValue({ id: '12' });

    await expect(controller.updateRequest('5', '10', payload)).resolves.toEqual({
      id: '12',
    });
    expect(improvementsService.updateRequest).toHaveBeenCalledWith(
      '5',
      '10',
      payload,
    );
  });
});