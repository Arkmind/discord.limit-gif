import { Injectable, Logger } from '@nestjs/common';
import { Once, InjectDiscordClient, On } from '@discord-nestjs/core';
import { Client, Message } from 'discord.js';
import { PrismaService } from 'src/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { JSDOM } from 'jsdom';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FollowChannel, MessageGif } from '@prisma/client';
import { BotService } from './bot.service';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);
  private followedChannels: string[] = [];

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly botService: BotService,
  ) {}

  @Once('ready')
  async onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`);

    await this.client.guilds.fetch();
    const channelsPerGuilds = await Promise.all(
      this.client.guilds.cache.map(async (guild) => {
        return guild.channels.fetch();
      }),
    );

    const promises = channelsPerGuilds
      .map((channels) =>
        channels
          .filter((channel) => channel.type === 'GUILD_TEXT')
          .map((channel) => this.botService.upsertNewChannel(channel)),
      )
      .flat();

    try {
      for (const promise of promises) {
        await promise;
      }
    } catch (error) {
      this.logger.log(error);
    } finally {
      this.logger.log('Successfully loaded all channels in database');
    }

    const followedChannels = await this.prismaService.followChannel.findMany({
      select: { channelId: true },
    });

    this.followedChannels = followedChannels.map(({ channelId }) => channelId);
  }

  @On('messageCreate')
  async onMessage(message: Message): Promise<void | MessageGif> {
    if (message.author.bot) return;
    if (this.followedChannels.indexOf(message.channelId) === -1) return;

    this.logger.log(`Incoming message: ${message.content}`);

    const isAGif = await this.botService.isMessageAGif(message);

    if (!isAGif) return;
    if (await this.isAuthorized(message))
      return await this.prismaService.messageGif.create({
        data: {
          id: message.id,
          message: message.content,
          user: {
            connectOrCreate: {
              where: { id: message.author.id },
              create: {
                id: message.author.id,
                avatar: message.author.avatar,
                username: message.author.username,
                discriminator: message.author.discriminator,
                mentionable: message.author.toString(),
              },
            },
          },
          followChannel: {
            connect: { channelId: message.channelId },
          },
        },
      });

    try {
      await message.delete();
    } catch (error) {
      this.logger.log(error);
    }
  }

  @OnEvent('bot.channel.add')
  handleChannelAdd(payload: FollowChannel) {
    this.followedChannels.push(payload.channelId);
  }

  @OnEvent('bot.channel.remove')
  handleChannelRemove(payload: FollowChannel) {
    const index = this.followedChannels.findIndex(
      (value) => value === payload.channelId,
    );

    this.followedChannels.splice(index, 1);
  }

  async isAuthorized(message: Message) {
    const lastSent = await this.prismaService.messageGif.findFirst({
      where: {
        userId: message.author.id,
        followChannelChannelId: message.channelId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!lastSent) return true;

    const duration = await this.botService.getDuration(message);

    return (
      lastSent.createdAt.getTime() + duration * 1000 < new Date().getTime()
    );
  }

  async checkChannel(message: Message) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: message.channelId,
      },
    });
  }
}
