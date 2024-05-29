import fs from "fs";
import path from "path";
import Loader from "./loader";
import StartNode from "./manager";

async function Main(client: any): Promise<void> {
    StartNode(client);
    await Loader(client);
}

export default Main;