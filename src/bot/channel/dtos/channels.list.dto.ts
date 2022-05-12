import { ParamType, Param } from '@discord-nestjs/core';

export class ListDto {
  @Param({
    name: 'page',
    description: 'Page of the channels',
    required: false,
    type: ParamType.NUMBER,
  })
  page: number;
}
