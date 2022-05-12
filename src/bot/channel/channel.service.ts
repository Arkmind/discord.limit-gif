import { AnyChannel, CategoryChannel, TextChannel } from 'discord.js';

export class ChannelService {
  transformChannel(channel: AnyChannel) {
    return channel as CategoryChannel | TextChannel;
  }
}
