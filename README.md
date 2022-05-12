<p align="center">
  <a href="https://github.com/Arkmind/discord.limit-gif/" target="blank"><img src="https://github.com/Arkmind/discord.limit-gif/blob/master/assets/logo.png?raw=true" width="320" alt="Gif Limiter Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://discord.gg" target="_blank">Discord</a> bot make to limit the usage of gifs on servers.</p>

## Installation
```bash
$ git clone git@github.com:Arkmind/discord.limit-gif.git
$ yarn
$ npx prisma migrate dev
```

## Running the app
```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Commands
#### `/channel list`
> Will list all watched channels

#### `/channel add channel:Channel *duration:number`
> Will add a channel to the watchlist and set a specific duration in between gif sent

#### `/channel duration duration:number *role:Mentionnable`
> Will set the global duration or specific rank duration in between gif sent

#### `/channel addall`
> Will add all accessible channels to the watchlist

#### `/channel remove channel:Channel`
> Will remove a channel from the watchlist

#### `/channel help`
> Will show a help that explains all commands 


## Credits

- Author - [Arkmind](https://github.com/Arkmind)
- NestJS - [https://nestjs.com](https://nestjs.com/)
- Discord.js - [https://discord.js.org](https://discord.js.org)
- Discord-nestjs - [Github](https://github.com/fjodor-rybakov/discord-nestjs)

## License

Discord.git-limiter is [MIT licensed](LICENSE).
