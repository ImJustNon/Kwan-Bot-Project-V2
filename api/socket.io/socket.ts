import { DisconnectReason, Namespace, Server, Socket } from "socket.io";
import { ClientParams } from "../../types/ClientTypes";
import { poru } from "../../music/poruPlayer";
import { Player } from "poru";
import { convertTime } from "../../utils/convertTime";
import si from "systeminformation";
import connectionLog from "./middlewares/connectionLog.middleware";
import playerUpdateController from "./controllers/playerUpdate.controller";
import systemInfoController from "./controllers/systemInfo.controller";

async function setupSocketIo(io: Server, client: ClientParams, callback: () => void): Promise<void> {
    const playerUpdateIO: Namespace = io.of("/playerupdate");
    const systemLoadIO: Namespace = io.of("/systemload");

    playerUpdateIO.use(connectionLog).on('connection', playerUpdateController);
    systemLoadIO.use(connectionLog).on("connection", systemInfoController);

    callback();
};

export default setupSocketIo;
