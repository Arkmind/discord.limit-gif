import {
  CommandExecutionContext,
  DiscordCommand,
  SubCommand,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CacheType,
  ContextMenuInteraction,
  MessagePayload,
  InteractionReplyOptions,
  MessageEmbed,
} from 'discord.js';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';
import { PrismaService } from 'src/prisma.service';

@SubCommand({
  name: 'list',
  description: 'List all channels in the gif limiter',
})
@Injectable()
export class ChannelListSubCommand implements DiscordCommand {
  constructor(private readonly prismaService: PrismaService) {}

  async handler(
    interaction:
      | CommandInteraction<CacheType>
      | ContextMenuInteraction<CacheType>,
  ) {
    const followedChannels = await this.prismaService.followChannel.findMany({
      where: {
        channel: {
          guildId: interaction.guildId,
        },
      },
      include: {
        user: true,
        channel: {
          include: { guild: true },
        },
      },
    });

    const fields = followedChannels.map(({ channel, user, duration }) => ({
      name: `#${channel.name}`,
      value: `Added by: **${user.username}#${
        user.discriminator
      }** | Check duration: **${duration || channel.guild.duration || 600}s**`,
      inline: false,
    }));

    const embed = new MessageEmbed()
      .setTitle('Channel list')
      .setColor('PURPLE')
      .addFields(...fields);

    return {
      embeds: [embed],
    };
  }
}
