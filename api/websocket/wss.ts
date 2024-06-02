import WebSocket, { WebSocketServer } from 'ws';
import { ClientParams } from "../../types/ClientTypes"
import { Server } from 'http';
import config from '../../config/config';

const setupWebSocket = (server: Server, client: ClientParams): WebSocketServer => {
    const wss = new WebSocketServer({ server });

    console.log(`> Websocket started on : ws://127.0.0.1:${config.server.port}`)

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

    return wss;
};

export default setupWebSocket;
