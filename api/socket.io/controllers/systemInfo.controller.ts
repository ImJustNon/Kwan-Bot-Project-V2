import { DisconnectReason, Socket } from "socket.io";
import si from "systeminformation";

async function systemInfoController(socket: Socket): Promise<void> {
    const systemInfoInterval = setInterval(async(): Promise<void> => {
        socket.emit("response", JSON.stringify({
            ...(await si.currentLoad()),
        }));
    }, 5 * 1000);

    socket.on('disconnect', (reason: DisconnectReason, description: any): void => {
        clearInterval(systemInfoInterval);
    });
}


export default systemInfoController;