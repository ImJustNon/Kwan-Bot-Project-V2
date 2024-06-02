import WebSocket, { WebSocketServer } from 'ws';
import { ClientParams } from "../../types/ClientTypes"
import { Server } from 'http';
import config from '../../config/config';

async function setupWebSocket(server: Server, client: ClientParams, callback: () => void): Promise<WebSocketServer> {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        console.log(`[Websocket] Client connected`)

        ws.on('message', (message) => {
            console.log(`[Websocket] Received message => ${message}`);
            // Example: Send a message back to the client
            ws.send('Hello from the server!');
        });

        ws.on('close', () => {
            console.log('[Websocket] Client disconnected');
        });
    });

    callback();

    return wss;
};

export default setupWebSocket;
