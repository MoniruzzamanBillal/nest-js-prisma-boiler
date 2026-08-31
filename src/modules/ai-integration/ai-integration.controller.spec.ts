import { Test, TestingModule } from '@nestjs/testing';
import { AiIntegrationController } from './ai-integration.controller';
import { AiIntegrationService } from './ai-integration.service';

describe('AiIntegrationController', () => {
  let controller: AiIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiIntegrationController],
      providers: [
        { provide: AiIntegrationService, useValue: { chat: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AiIntegrationController>(AiIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
