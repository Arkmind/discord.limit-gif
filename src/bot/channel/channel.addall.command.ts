import { DiscordCommand, SubCommand } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CacheType,
  Collection,
  CommandInteraction,
  NonThreadGuildBasedChannel,
} from 'discord.js';
import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma.service';

@SubCommand({
  name: 'addall',
  description: 'Add all channels of the guild to the gif limiter',
})
@Injectable()
export class ChannelAddAllSubCommand implements DiscordCommand {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly i18n: I18nService,
  ) {}

  async handler(interaction: CommandInteraction<CacheType>) {
    if (
      ['GUILD_TEXT', 'GUILD_CATEGORY'].indexOf(interaction.channel.type) === -1
    ) {
      return this.i18n.t('en-GB', 'bot.channel.NOT_IN_GUILD');
    }

    let channels: Collection<string, NonThreadGuildBasedChannel>;

    try {
      channels = await interaction.guild.channels.fetch();
    } catch (error) {
      return this.i18n.t('en-GB', 'bot.channel.addall.ERROR');
    }

    const promises = channels
      .filter((channel) => channel.type === 'GUILD_TEXT')
      .map((channel) => {
        const createUpdate = {
          channel: {
            connectOrCreate: {
              where: {
                id: channel.id,
              },
              create: {
                id: channel.id,
                name: channel.name,
                deleted: false,
                type: channel.type,
                mentionable: channel.toString(),
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
                mentionable: interaction.user.toString(),
              },
            },
          },
        };

        return this.prismaService.followChannel.upsert({
          where: {
            channelId: channel.id,
          },
          update: {},
          create: {
            ...createUpdate,
          },
        });
      });

    try {
      for (const promise of promises) {
        const followChannel = await promise;
        this.eventEmitter.emit('bot.channel.add', followChannel);
      }

      return this.i18n.t('en-GB', 'bot.channel.addall.SUCCESS');
    } catch (error) {
      return this.i18n.t('en-GB', 'bot.channel.addall.ERROR');
    }
  }
}
