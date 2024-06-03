import WebSocket, { WebSocketServer } from 'ws';
import { ClientParams } from "../../types/ClientTypes";
import { IncomingMessage, Server } from 'http';
import config from '../../config/config';
import { poru } from "../../music/poruPlayer";
import { Player } from 'poru';
import { convertTime } from '../../utils/convertTime';

async function setupWebSocket(server: Server, client: ClientParams, callback: () => void): Promise<WebSocketServer> {
    const wss: WebSocketServer = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        console.log(`[Websocket] Client connected`);
        console.log(req.url?.split("="));

        poru.on("playerUpdate", async(player: Player): Promise<void> =>{
            ws.send(JSON.stringify({
                track: {
                    previous: player.previousTrack,
                    current: player.currentTrack,
                    queue: player.queue,
                },
                guidId: player.guildId,
                voiceChannelId: player.voiceChannel,
                textChannelId: player.textChannel,
                isPlaying: player.isPlaying,
                isPaused: player.isPaused,
                isConnected: player.isConnected,
                loop: player.loop,
                position: player.position,
                parsedPosition: convertTime(player.position),
                ping: player.ping,
                timestamp: player.timestamp,
                mute: player.mute,
                deaf: player.deaf,
                volume: player.volume
            }));
        });
        

        ws.on('message', (message) => {
            console.log(`[Websocket] Received message => ${message}`);
        });

        ws.on('close', () => {
            console.log('[Websocket] Client disconnected');
        });
    });

    callback();

    return wss;
};

export default setupWebSocket;
