import fs from "fs";
import path from "path";
import { ClientParams } from "../types/ClientTypes";

async function Loader(client: ClientParams): Promise<void> {
    console.log("Loaded");
}

export default Loader;