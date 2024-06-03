import { Server, Socket } from "socket.io";
import { ClientParams } from "../../types/ClientTypes";


async function setupSocketIo(io: Server, client: ClientParams, callback: () => void): Promise<void> {
    
    io.on('connection', (socket: Socket) => {
        console.log('A user connected');
    
        socket.emit('message', 'Welcome to the server!');
    
        socket.on('chat message', (msg: string) => {
          console.log('message: ' + msg);
          io.emit('chat message', msg);
        });
    
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    callback();
};

export default setupSocketIo;
