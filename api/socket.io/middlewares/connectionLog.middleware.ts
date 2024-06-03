import { DisconnectReason, Socket } from "socket.io";

function connectionLog(socket: Socket, next: any): void {
    console.log(`[Websocket] Client connected : ${socket.nsp.name} : ${socket.id}`);
    socket.on('disconnect', (reason: DisconnectReason, description: any): void => {
        console.log(`[Websocket] Client disconnected : ${socket.nsp.name} : ${socket.id}`);
    });
    next();
}


export default connectionLog;