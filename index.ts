import dotenv from "dotenv";
dotenv.config();
import config from "./config/config";
import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';
import { Interaction } from "discord.js";
import fs from "fs";
import path from "path";
import { CommandConfig } from "./types/CommandTypes";
import Main from "./music/main";
import "@discordjs/voice";

const client: any = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ], 
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ],
});

client.commands = new Collection();
client.modules = fs.readdirSync('./commands');

export {
    client
}

const findHandlerFiles: Array<string> = fs.readdirSync(path.join(__dirname, "./handlers"))
const filteredHanderFiles: Array<string> = findHandlerFiles.filter((filename: string) => filename.endsWith(".ts"));
for (const file of filteredHanderFiles) {
    const filePath = path.join(__dirname, "./handlers", file);
    import(filePath).then(async fileData => {
        await fileData.default(client, config);
    });
}

client.login(config.client.token).then(() =>{
    Main(client);
});

