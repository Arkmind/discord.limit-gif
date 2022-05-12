import { TransformPipe } from '@discord-nestjs/common';
import {
  DiscordTransformedCommand,
  InjectDiscordClient,
  Payload,
  SubCommand,
  UsePipes,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client } from 'discord.js';
import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma.service';
import { ChannelService } from './channel.service';
import { ChannelsRemoveDto } from './dtos/channels.remove.dto';

@SubCommand({
  name: 'remove',
  description: 'Remove a channel from the gif limiter',
})
@Injectable()
@UsePipes(TransformPipe)
export class ChannelRemoveSubCommand
  implements DiscordTransformedCommand<ChannelsRemoveDto>
{
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly channelService: ChannelService,
    private readonly i18n: I18nService,
  ) {}

  async handler(@Payload() dto: ChannelsRemoveDto) {
    if (!dto.channel) return this.i18n.t('en-GB', 'bot.channel.MISSING_INPUT');

    const chann = await this.client.channels.fetch(dto.channel);

    if (['GUILD_TEXT', 'GUILD_CATEGORY'].indexOf(chann.type) === -1) {
      return this.i18n.t('en-GB', 'bot.channel.NOT_IN_GUILD');
    }

    const channel = this.channelService.transformChannel(chann);

    try {
      const followChannel = await this.prismaService.followChannel.delete({
        where: {
          channelId: channel.id,
        },
      });

      this.eventEmitter.emit('bot.channel.remove', followChannel);

      return this.i18n.t('en-GB', 'bot.channel.remove.SUCCESS', channel.name);
    } catch (error) {
      return this.i18n.t('en-GB', 'bot.channel.remove.ERROR', channel.name);
    }
  }
}
