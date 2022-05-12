import { Injectable } from '@nestjs/common';
import {
  DiscordModuleOption,
  DiscordOptionsFactory,
} from '@discord-nestjs/core';
import { Intents } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { ChannelCommand } from 'src/bot/channel/channel.command';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';

@Injectable()
export class DiscordConfigService implements DiscordOptionsFactory {
  constructor(private configService: ConfigService) {}

  createDiscordOptions(): DiscordModuleOption {
    return {
      token: this.configService.get<string>('BOT_TOKEN'),
      discordClientOptions: {
        intents: [
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.DIRECT_MESSAGES,
          Intents.FLAGS.GUILD_MESSAGES,
        ],
      },
      autoLogin: true,
    };
  }
}
