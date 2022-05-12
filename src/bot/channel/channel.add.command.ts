import { TransformPipe } from '@discord-nestjs/common';
import {
  DiscordTransformedCommand,
  InjectDiscordClient,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client } from 'discord.js';
import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma.service';
import { ChannelService } from './channel.service';
import { ChannelsAddDto } from './dtos/channels.add.dto';

@SubCommand({
  name: 'add',
  description: 'Add a channel to the gif limiter',
})
@Injectable()
@UsePipes(TransformPipe)
export class ChannelAddSubCommand
  implements DiscordTransformedCommand<ChannelsAddDto>
{
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly channelService: ChannelService,
    private readonly i18n: I18nService,
  ) {}

  async handler(
    @Payload() dto: ChannelsAddDto,
    { interaction }: TransformedCommandExecutionContext<any>,
  ) {
    if (!dto.channel) return this.i18n.t('en-GB', 'bot.channel.MISSING_INPUT');

    const chann = await this.client.channels.fetch(dto.channel);

    if (['GUILD_TEXT', 'GUILD_CATEGORY'].indexOf(chann.type) === -1) {
      return this.i18n.t('en-GB', 'bot.channel.NOT_IN_GUILD');
    }

    const channel = this.channelService.transformChannel(chann);

    const createUpdate = {
      channel: {
        connectOrCreate: {
          where: {
            id: channel.id,
          },
          create: {
            id: channel.id,
            name: channel.name,
            mentionable: channel.toString(),
            deleted: false,
            type: channel.type,
            createdAt: channel.createdAt,
            guild: {
              connectOrCreate: {
                where: {
                  id: channel.guild.id,
                },
                create: {
                  id: channel.guild.id,
                  name: channel.guild.name,
                  duration: 600,
                },
              },
            },
          },
        },
      },
      user: {
        connectOrCreate: {
          where: {
            id: interaction.user.id,
          },
          create: {
            id: interaction.user.id,
            avatar: interaction.user.avatar,
            username: interaction.user.username,
            discriminator: interaction.user.discriminator,
          },
        },
      },
    };

    const followChannel = await this.prismaService.followChannel.upsert({
      where: {
        channelId: channel.id,
      },
      update: {
        duration: dto.duration,
      },
      create: {
        ...createUpdate,
        duration: dto.duration,
      },
    });

    this.eventEmitter.emit('bot.channel.add', followChannel);

    return this.i18n.t(
      'en-GB',
      'bot.channel.add.SUCCESS',
      channel.toString(),
      dto.duration !== undefined ? `(duration set to ${dto.duration})` : ' ',
    );
  }
}
