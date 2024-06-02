import fs from "fs";
import path from "path";
import { ClientParams } from "../types/ClientTypes";

async function Loader(client: ClientParams): Promise<void> {
    const findEventFile: string[] = fs.readdirSync(path.join(__dirname, "./events"));
    const filteredEventFile: string[] = findEventFile.filter((filename: string) => filename.includes(".event."));

    let fileCount: number = 0;
    
    for(const file of filteredEventFile){
        try {
            const eventPath: string = path.join(__dirname, "./events", file);
            const event = await import(eventPath);
            event.default(client);
            console.log(`[Nodes] Loaded Event : ${file}`);
            fileCount++;
        }
        catch(e){
            console.log(`[Nodes] Error to Load : ${file} : ERROR : ${e}`);
        }
    }
    console.log(`[Nodes] Loaded Successful : ${fileCount}`);
}

export default Loader;