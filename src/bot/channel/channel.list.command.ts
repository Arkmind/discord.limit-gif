import { TransformPipe } from '@discord-nestjs/common';
import {
  DiscordTransformedCommand,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { MessageEmbed } from 'discord.js';
import { I18nService } from 'src/i18n/i18n.service';
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
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async handler(
    @Payload() dto: ListDto,
    { interaction }: TransformedCommandExecutionContext<any>,
  ) {
    const itemsPerPage = 10;
    const page = dto?.page || 1;

    const count = await this.prismaService.followChannel.count({
      where: { channel: { guildId: interaction.guildId } },
    });

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
      skip: itemsPerPage * (page - 1),
    });

    const fields = followedChannels.map(({ channel, user, duration }) => ({
      name: `#${channel.name}`,
      value: `Added by: **${user.username}#${
        user.discriminator
      }** | Check duration: **${duration || channel.guild.duration || 600}s**`,
      inline: false,
    }));

    if (page > Math.ceil(count / itemsPerPage)) {
      return this.i18n.t('en-GB', 'bot.channel.list.NO_MORE_PAGES');
    }

    const embed = new MessageEmbed()
      .setTitle('Channel list')
      .setDescription(`Page : ${page}/${Math.ceil(count / itemsPerPage)}`)
      .setColor('PURPLE')
      .addFields(...fields);

    return {
      embeds: [embed],
    };
  }
}
