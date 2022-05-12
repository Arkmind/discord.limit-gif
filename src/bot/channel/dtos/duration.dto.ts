import { ParamType, Param } from '@discord-nestjs/core';

export class DurationDto {
  @Param({
    name: 'duration',
    description: 'Duration in seconds between two gifs (default is 600)',
    required: true,
    type: ParamType.NUMBER,
  })
  duration: number;
}
