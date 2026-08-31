import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty({ message: 'Prompt is required' })
  @MaxLength(4000)
  prompt: string;
}
