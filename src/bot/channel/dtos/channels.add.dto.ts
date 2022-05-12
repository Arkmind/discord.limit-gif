import { ParamType, Param, Channel } from '@discord-nestjs/core';
import { ChannelTypes } from 'discord.js/typings/enums';

export class ChannelsAddDto {
  @Channel([ChannelTypes.GUILD_TEXT])
  @Param({
    name: 'channel',
    description: 'Channel to add in watch list',
    required: true,
    type: ParamType.STRING,
  })
  channel: string;

  @Param({
    name: 'duration',
    description:
      'Set the duration between two gifs in this channels (in seconds) (by default global duration is used)',
    required: false,
    type: ParamType.NUMBER,
  })
  duration: number;
}
