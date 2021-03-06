export default {
  bot: {
    channel: {
      NOT_IN_GUILD:
        'You are not in a guild. Wait are you really trying to use me in DMs ? ๐คจ',
      MISSING_INPUT:
        'An input in missing. Wait, this should not be happening ๐คจ',
      add: {
        SUCCESS: 'Channel %name% is now watched ๐ง %duration%',
      },
      remove: {
        SUCCESS: 'Successfully removed %name% from watched channels ๐',
        ERROR:
          'The channel %name% seems not to be watched, use list to see all watched channels ๐ค',
      },
      duration: {
        SUCCESS:
          'Successfully set the global duration to %duration% second%plural% ๐',
        SUCCESS_ROLE:
          'Successfully set the duration of %role% to %duration% second%plural% ๐ *(to reset it set duration to -1)*',
        SUCCESS_RESET: 'Successfully reset the duration of %role% ๐ฉโ๐',
        ERROR:
          "A strange error occured, sorry for the inconvenience, we'll soon launch an expedition to fix this ๐จโ๐๐",
        ERROR_INVALID_TIME:
          "Duration must be more than 0, sorry i can't go back in time ๐ค",
        ERROR_ROLE:
          "Did you tried to add a specific user ? Sorry but i'm not handling this at the moment ๐ถ",
      },
      addall: {
        ERROR:
          "Sorry but that was a bit too much for me, seems like i'm not able to do it ๐ฐ",
        SUCCESS: 'Successfully added all channels to the watch list ๐',
      },
      list: {
        NO_MORE_PAGES:
          "You've reached the end of the world, seems like there's no more pages to show โตโ ",
      },
    },
  },
};
