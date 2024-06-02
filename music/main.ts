import fs from "fs";
import path from "path";
import Loader from "./loader";
import StartNode from "./poruPlayer";
import { ClientParams } from "../types/ClientTypes";

async function setupPlayer(client: ClientParams, callback: () => void): Promise<void> {
    await StartNode(client);
    await Loader(client);
    callback();
}

export default setupPlayer;