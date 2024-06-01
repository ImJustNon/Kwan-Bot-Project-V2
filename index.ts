import { Client, GatewayIntentBits, Collection, Partials, WebSocketShard } from 'discord.js';
import dotenv from "dotenv";
import config from "./config/config";
import { Interaction } from "discord.js";
import fs from "fs";
import path from "path";
import { CommandConfig } from "./types/CommandTypes";
import StartPlayer from "./music/main";
import "@discordjs/voice";
import { poru } from "./music/poruPlayer";

dotenv.config();

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

client.setMaxListeners(20); // You can set this to a number that suits your needs
client.ws.shards.forEach((shard: WebSocketShard) => {
  shard.setMaxListeners(20);
});

export {
    client
}

const findHandlerFiles: string[] = fs.readdirSync(path.join(__dirname, "./handlers"))
const filteredHanderFiles: string[] = findHandlerFiles.filter((filename: string) => filename.endsWith(".ts"));
for (const file of filteredHanderFiles) {
    const filePath = path.join(__dirname, "./handlers", file);
    import(filePath).then(async fileData => {
        await fileData.default(client, config);
    });
}

client.login(config.client.sharding ? undefined : config.client.token).then(async() =>{
    await StartPlayer(client);
});

