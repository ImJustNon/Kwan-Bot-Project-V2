import fs from "fs";
import path from "path";
import Loader from "./loader";
import StartNode from "./player";
import { ClientParams } from "../types/ClientTypes";

async function Main(client: ClientParams): Promise<void> {
    await StartNode(client);
    await Loader(client);
}

export default Main;