import { Body, Controller, Post } from '@nestjs/common';
import { AiIntegrationService } from './ai-integration.service';
import { ChatDto } from './dto/chat.dto';

@Controller('ai-integration')
export class AiIntegrationController {
  constructor(private readonly aiIntegrationService: AiIntegrationService) {}

  @Post('chat')
  async chat(@Body() payload: ChatDto) {
    return {
      reply: await this.aiIntegrationService.chat(payload.prompt),
    };
  }
}
