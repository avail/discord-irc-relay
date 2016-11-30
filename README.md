# Discord<->IRC relay


## How to run
1. Copy **example_config.json** to **config.json**, or any custom name. We'll go with **config-walls.json** for this guide.
2. Modify the config file to your liking
    1. set `discord_server_id` to the server the bot is in
    2. set `discord_channel_id` to the channel the bot is going to relay to
    3. set `discord_token` to your bot's token
    4. set `irc_server` to the hostname/ip of the server you want it to connect to
    5. set `irc_nick` to what you want the bot's nick to be
    6. set `irc_nickserv` to the bot's nickserv password, if registered
    7. set `irc_hostserv` to `true` or `false` depending on if your irc bot has a hostserv host assigned to it
    8. set `irc_channel` to the channel you want the bot to relay to
3. Run the bot by typing **node relay.js --config config-walls.json** (--config flag not required, it will default to **config.json**)


## Supervisor configuration
This is just my personal config, feel free to use it as a base.
```
[program:relay-walls]
command=/home/avail/.nvm/versions/node/v7.1.0/bin/node /home/avail/discord-irc-relay/relay.js --config /home/avail/discord-irc-relay/config-walls.json
directory=/home/avail/discord-irc-relay
user=avail
autostart=true
autorestart=true
stopsignal=QUIT
```