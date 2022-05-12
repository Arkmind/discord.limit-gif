import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { BotGateway } from './bot.gateway';
import { ChannelModule } from './channel/channel.module';
import { PrismaService } from 'src/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { BotService } from './bot.service';

@Module({
  imports: [DiscordModule.forFeature(), ChannelModule, HttpModule],
  providers: [BotGateway, BotService, PrismaService],
})
export class BotModule {}
