import { ClientParams } from "../../types/ClientTypes";
import fs from "fs";
import path from "path";

async function Main(client: ClientParams): Promise<void> {
    const eventFiles: string[] = fs.readdirSync(path.join(__dirname, "./events"));
    const filterEventFiles: string[] = eventFiles.filter((filename: string) => filename.includes(".event."));
    let loadedCount: number = 0;

    for(const file of filterEventFiles){
        try {
            const eventFilePath = path.join(__dirname, "./events", file);
            await import(eventFilePath).then(async data => {
                await data.default(client);
                console.log(`[Music-Channel-Feature] Loaded Event : ${file}`);
                loadedCount++;
            });    
        }
        catch(e) {
            console.log(`[Music-Channel-Feature] Fail To Load : ${file} : ${e}`);
        }
    }

    console.log(`[Music-Channel-Feature] Loaded Sussessful : ${loadedCount}`);
}

export default Main;