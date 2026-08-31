import { Test, TestingModule } from '@nestjs/testing';
import { AiIntegrationService } from './ai-integration.service';
import { AiClientService } from './ai-client.service';

describe('AiIntegrationService', () => {
  let service: AiIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiIntegrationService,
        { provide: AiClientService, useValue: { ask: jest.fn() } },
      ],
    }).compile();

    service = module.get<AiIntegrationService>(AiIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
