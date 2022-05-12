import { TransformPipe } from '@discord-nestjs/common';
import {
  DiscordTransformedCommand,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
} from '@discord-nestjs/core';
import { Injectable, UsePipes } from '@nestjs/common';
import { MessageEmbed } from 'discord.js';
import { PrismaService } from 'src/prisma.service';
import { ListDto } from './dtos/channels.list.dto';

@SubCommand({
  name: 'list',
  description: 'List all channels in the gif limiter',
})
@Injectable()
@UsePipes(TransformPipe)
export class ChannelListSubCommand
  implements DiscordTransformedCommand<ListDto>
{
  constructor(private readonly prismaService: PrismaService) {}

  async handler(
    @Payload() dto: ListDto,
    { interaction }: TransformedCommandExecutionContext<any>,
  ) {
    const itemsPerPage = 10;
    const page = dto?.page || 1;

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
      take: itemsPerPage,
      skip: itemsPerPage * page - 1,
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
