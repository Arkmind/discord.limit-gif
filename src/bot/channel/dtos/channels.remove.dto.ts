import { ParamType, Param, Channel } from '@discord-nestjs/core';
import { ChannelTypes } from 'discord.js/typings/enums';

export class ChannelsRemoveDto {
  @Channel([ChannelTypes.GUILD_TEXT])
  @Param({
    name: 'channel',
    description: 'Channel to remove from watch list',
    required: true,
    type: ParamType.STRING,
  })
  channel: string;
}
