import fs from "fs";
import path from "path";
import Loader from "./loader";
import StartNode from "./shoukaku";
import { ClientParams } from "../types/ClientTypes";

async function Main(client: ClientParams): Promise<void> {
    StartNode(client);
    await Loader(client);
}

export default Main;