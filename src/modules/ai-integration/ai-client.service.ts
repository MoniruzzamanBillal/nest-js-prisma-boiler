import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import OpenAI from 'openai';

export type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export type AskOptions = {
  jsonMode?: boolean;
  temperature?: number;
};

// ! single choke point every ai feature talks through - if one free model is
// ! rate limited/down, fall back to the next
@Injectable()
export class AiClientService {
  private readonly logger = new Logger(AiClientService.name);

  private readonly client: OpenAI;

  private readonly FREE_MODELS = [
    'arcee-ai/trinity-large-preview:free',
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'qwen/qwen3-next-80b-a3b-instruct:free',
  ];

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      timeout: 20_000,
      maxRetries: 0,
      defaultHeaders: {
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
        // ! placeholder — swap for your project's name/deployed URL
        'X-Title': 'Nest Prisma Boilerplate',
      },
    });
  }

  async ask(messages: ChatMessage[], options?: AskOptions): Promise<string> {
    let lastError: unknown;

    for (const model of this.FREE_MODELS) {
      try {
        const response = await this.client.chat.completions.create({
          model,
          messages,
          temperature: options?.temperature ?? 0.7,
          ...(options?.jsonMode
            ? { response_format: { type: 'json_object' as const } }
            : {}),
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
          throw new Error('Empty response from model');
        }

        return content;
      } catch (error) {
        lastError = error;
        continue;
      }
    }

    this.logger.error('All free models failed', lastError);

    throw new ServiceUnavailableException(
      'AI service is busy right now, please try again shortly',
    );
  }
}
