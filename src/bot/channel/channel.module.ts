import { DiscordModule, ReflectMetadataProvider } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma.service';
import { ChannelAddSubCommand } from './channel.add.command';
import { ChannelAddAllSubCommand } from './channel.addall.command';
import { ChannelCommand } from './channel.command';
import { ChannelDurationSubCommand } from './channel.duration.command';
import { ChannelHelpSubCommand } from './channel.help.command';
import { ChannelListSubCommand } from './channel.list.command';
import { ChannelRemoveSubCommand } from './channel.remove.command';
import { ChannelService } from './channel.service';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [
    I18nService,
    ChannelCommand,
    ChannelHelpSubCommand,
    ChannelAddSubCommand,
    ChannelAddAllSubCommand,
    ChannelRemoveSubCommand,
    ChannelDurationSubCommand,
    ChannelListSubCommand,
    ReflectMetadataProvider,
    PrismaService,
    ChannelService,
  ],
})
export class ChannelModule {}
