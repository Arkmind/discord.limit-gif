import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Message, NonThreadGuildBasedChannel } from 'discord.js';
import { JSDOM } from 'jsdom';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BotService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  upsertNewChannel(channel: NonThreadGuildBasedChannel) {
    const data = {
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
    };

    return this.prismaService.channel.upsert({
      where: { id: channel.id },
      update: { ...data },
      create: { ...data },
    });
  }

  async getDuration(message: Message) {
    const followChannel = await this.prismaService.followChannel.findUnique({
      where: { channelId: message.channelId },
    });

    if (followChannel.duration) return followChannel.duration;

    const guild = await this.prismaService.guild.findUnique({
      where: { id: message.guildId },
    });

    return guild.duration || 600;
  }

  async isContentTypeOfOGAGif(url: string) {
    const response = await lastValueFrom(
      this.httpService.get(url, {
        headers: {
          Accept: 'text/html',
          'Content-Type': 'text/html',
        },
      }),
    );

    const { window } = new JSDOM(response.data);

    const metas = window.document.querySelectorAll('meta[property]');

    const preview = Array.from(metas).filter(
      (meta: HTMLMetaElement) => meta.getAttribute('property') === 'og:image',
    );

    return !!preview.find((meta) =>
      /(http(s?):)([/|.|\w|\s|-])*\.(?:webp|gif)/.test(
        meta.getAttribute('content'),
      ),
    );
  }

  async isMessageAGif(message: Message) {
    if (
      (message.attachments.size > 0 &&
        message.attachments.find(
          (attachment) =>
            ['image/gif', 'image/webp'].indexOf(attachment.contentType) !== -1,
        )) ||
      /(http(s?):)([/|.|\w|\s|-])*\.(?:webp|gif)/.test(message.content)
    ) {
      return true;
    }

    if (
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
        message.content,
      )
    ) {
      return await this.isContentTypeOfOGAGif(message.content);
    }

    return false;
  }
}
