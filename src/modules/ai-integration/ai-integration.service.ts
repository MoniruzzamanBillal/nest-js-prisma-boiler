import { Injectable } from '@nestjs/common';
import { AiClientService, ChatMessage } from './ai-client.service';

@Injectable()
export class AiIntegrationService {
  constructor(private readonly aiClientService: AiClientService) {}

  // ! for chating
  async chat(prompt: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'Format responses using Markdown with headings, lists, and code blocks',
      },
      { role: 'user', content: prompt },
    ];

    return this.aiClientService.ask(messages);
  }
}
