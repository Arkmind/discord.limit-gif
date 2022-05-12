import { Command, DiscordCommand } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { MessageEmbed } from 'discord.js';
import { ChannelAddSubCommand } from './channel.add.command';
import { ChannelAddAllSubCommand } from './channel.addall.command';
import { ChannelDurationSubCommand } from './channel.duration.command';
import { ChannelHelpSubCommand } from './channel.help.command';
import { ChannelListSubCommand } from './channel.list.command';
import { ChannelRemoveSubCommand } from './channel.remove.command';

@Command({
  name: 'channel',
  description: 'Handle channels the bot is currently watching',
  include: [
    ChannelHelpSubCommand,
    ChannelAddSubCommand,
    ChannelAddAllSubCommand,
    ChannelRemoveSubCommand,
    ChannelDurationSubCommand,
    ChannelListSubCommand,
  ],
})
@Injectable()
export class ChannelCommand implements DiscordCommand {
  handler() {
    const embed = new MessageEmbed()
      .setTitle('Command list')
      .setColor('PURPLE')
      .addFields(
        {
          name: 'list',
          value: 'Will list every followed channel of current guild',
        },
        {
          name: 'add',
          value: 'Will add a channel to the watch list of the current guild',
        },
        {
          name: 'addall',
          value: 'Will add all channels to the watch list of the current guild',
        },
        {
          name: 'remove',
          value:
            'Will remove a channel from the watch list of the current guild',
        },
        {
          name: 'duration',
          value: 'Will change the global duration of the current guild',
        },
      );

    return {
      embeds: [embed],
    };
  }
}
