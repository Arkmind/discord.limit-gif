import { DiscordCommand, SubCommand } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { MessageEmbed } from 'discord.js';

@SubCommand({
  name: 'help',
  description: 'See all commands of Gif Limiter',
})
@Injectable()
export class ChannelHelpSubCommand implements DiscordCommand {
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
