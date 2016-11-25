const log4js = require("log4js");
const logger = log4js.getLogger();

const util = require("util");
const nconf = require('nconf');

const Discord = require('discord.io');
const Irc = require("irc");

nconf.argv().env().file('config.json').defaults({
    "discord_channel_id": "",
    "discord_token": "",

    "irc_server": "",
    "irc_nick": "",
    "irc_nickserv": "",
    "irc_hostserv": false,
    "irc_channel": ""
});

const discord_bot = new Discord.Client({
    token: nconf.get("discord_token"),
    autorun: true
});

const irc_bot = new Irc.Client(nconf.get("irc_server"), nconf.get("irc_nick"), {
    userName: nconf.get("irc_nick"),
    realName: "avail's IRC<->Discord relay",
    encoding: "utf-8",
    autoConnect: false
});

var connected = { "discord": false, "irc": false };

/*** MESSAGE FUNCS ***/
function SendIrcMessage(message) {
    if (connected["irc"] != true) return;

    logger.info("[IRC] Sending message: %s", message);
    irc_bot.say(nconf.get("irc_channel"), message);
}

function SendDiscordMessage(message) {
    if (connected["discord"] != true) return;

    logger.info("[Discord] Sending message: %s", message);
    discord_bot.sendMessage({to: nconf.get("discord_channel_id"), message: message});
}

/*** DISCORD SETUP ***/
discord_bot.on('ready', function(event) {
    logger.info("[Discord] Logged in as %s", discord_bot.username);

    connected["discord"] = true;
});

discord_bot.on('message', function(user, userID, channelID, message, event) {
    if (userID == discord_bot.id && channelID != nconf.get("discord_channel_id")) return;

    SendIrcMessage(util.format("<%s> %s", user, message));
});

/*** IRC SETUP ***/
irc_bot.addListener("error", function(message) {
    logger.error("irc died: ", message);
});

irc_bot.addListener("message", function(from, to, message) {
    SendDiscordMessage(util.format("**<%s>** %s", from, message));
});

irc_bot.connect(0, function(reply) {
    // auth us
    irc_bot.say("NickServ", util.format("IDENTIFY %s", nconf.get("irc_nickserv")));

    // hostname
    irc_bot.say("HostServ", (nconf.get("irc_hostserv") ? "on" : "off")); // lol

    logger.info("[IRC] Logged in as %s", irc_bot.nick);

    irc_bot.join(nconf.get("irc_channel"));

    connected["irc"] = true;
});
