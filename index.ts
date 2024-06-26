import { Client, GatewayIntentBits, Collection, Partials, WebSocketShard } from 'discord.js';
import dotenv from "dotenv";
import config from "./config/config";
import { Interaction } from "discord.js";
import fs from "fs";
import path from "path";
import { CommandConfig } from "./types/CommandTypes";
import setupPlayer from "./music/main";
import "@discordjs/voice";
import { poru } from "./music/poruPlayer";
import express, { Application } from "express";
import { Express } from 'express';
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import AppRouter from "./api/routes/appRouter";
import setupWebSocket from './api/websocket/wss';
import { createServer, Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import setupSocketIo from './api/socket.io/socket';
// import WebSocket, { WebSocketServer } from 'ws';

dotenv.config();

const app: Application = express();
const server: Server = createServer(app);
const io: SocketIOServer = new SocketIOServer(server);
// const wss: WebSocketServer = new WebSocketServer({ 
//     server: server, 
//     path: "/ws" 
// });



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


app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
}));
app.use(express.json({
    limit: "50mb",
}));
app.use("/", AppRouter(client));



const findHandlerFiles: string[] = fs.readdirSync(path.join(__dirname, "./handlers"))
const filteredHanderFiles: string[] = findHandlerFiles.filter((filename: string) => filename.includes(".handler."));
for (const file of filteredHanderFiles) {
    const filePath = path.join(__dirname, "./handlers", file);
    import(filePath).then(async fileData => {
        await fileData.default(client, config);
        console.log(`[Handler-Loader] Loaded : `, file);
    });
}




// client login
client.login(config.client.sharding ? undefined : config.client.token).then(async() =>{
    // Set up the Player
    await setupPlayer(client, () =>{
        console.log(`> Music Player : Started`);
    });
    // app start port
    server.listen(config.server.port, (): void =>{
        console.log(`> RestAPI Listening on : http://127.0.0.1:${config.server.port}`);
    });
    // Set up the WebSocket server
    // await setupWebSocket(wss, client, (): void =>{
    //     console.log(`> Websocket Listening on : ws://127.0.0.1:${config.server.port}/ws`);
    // });
    // Setup the socket.io Server
    await setupSocketIo(io, client, (): void =>{
        console.log(`> Socket.io Listening on : ws://127.0.0.1:${config.server.port}${io.path()}`);
    });
});





