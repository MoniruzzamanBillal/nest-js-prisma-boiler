import { Module } from '@nestjs/common';
import { AiClientService } from './ai-client.service';
import { AiIntegrationController } from './ai-integration.controller';
import { AiIntegrationService } from './ai-integration.service';

@Module({
  controllers: [AiIntegrationController],
  providers: [AiIntegrationService, AiClientService],
  exports: [AiClientService],
})
export class AiIntegrationModule {}
