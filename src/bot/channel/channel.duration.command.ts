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
import { Client } from 'discord.js';
import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma.service';
import { DurationDto } from './dtos/duration.dto';

@SubCommand({
  name: 'duration',
  description:
    'Set the global time limit between two gifs in seconds (600s = 10mn)',
})
@Injectable()
@UsePipes(TransformPipe)
export class ChannelDurationSubCommand
  implements DiscordTransformedCommand<DurationDto>
{
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async handler(
    @Payload() dto: DurationDto,
    { interaction }: TransformedCommandExecutionContext<any>,
  ) {
    if (['GUILD_TEXT', 'GUILD_CATEGORY'].indexOf(interaction.channel.type)) {
      return this.i18n.t('en-GB', 'bot.channel.NOT_IN_GUILD');
    }

    if (dto.role) {
      const role = this.client.guilds.cache
        .find((guild) => guild.id === interaction.guildId)
        .roles.cache.find((role) => role.id === dto.role);

      if (!role) return this.i18n.t('en-GB', 'bot.channel.duration.ERROR_ROLE');

      try {
        await this.prismaService.role.upsert({
          where: { id: role.id },
          create: {
            id: role.id,
            name: role.name,
            createdAt: role.createdAt,
            color: role.color,
            guildId: interaction.guildId,
            duration: dto.duration,
          },
          update: {
            duration: dto.duration === -1 ? null : dto.duration,
          },
        });

        if (dto.duration === -1) {
          return this.i18n.t(
            'en-GB',
            'bot.channel.duration.SUCCESS_RESET',
            role.toString(),
          );
        }

        return this.i18n.t(
          'en-GB',
          'bot.channel.duration.SUCCESS_ROLE',
          role.toString(),
          dto.duration,
          dto.duration > 1 ? 's' : ' ',
        );
      } catch (error) {
        return this.i18n.t('en-GB', 'bot.channel.duration.ERROR');
      }
    }

    if (dto.duration < 0)
      return this.i18n.t('en-GB', 'bot.channel.duration.ERROR_INVALID_TIME');

    try {
      await this.prismaService.guild.update({
        where: {
          id: interaction.guildId,
        },
        data: {
          duration: dto.duration,
        },
      });

      return this.i18n.t(
        'en-GB',
        'bot.channel.duration.SUCCESS',
        dto.duration,
        dto.duration > 1 ? 's' : ' ',
      );
    } catch (error) {
      return this.i18n.t('en-GB', 'bot.channel.duration.ERROR');
    }
  }
}
