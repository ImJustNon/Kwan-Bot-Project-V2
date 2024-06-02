import fs from 'fs';
import path from 'path';
import { Client } from 'discord.js';
import { CommandConfig } from '../types/CommandTypes';
import { ClientParams } from '../types/ClientTypes';


async function EventHander(client: ClientParams, config: any): Promise<void> {
    const eventsPath: string = path.join(__dirname, '../events');
    const files: string[] = fs.readdirSync(eventsPath).filter((file: string) => file.includes('.event.'));
    let filesCount: number = 0;

    
    files.forEach((file: string) => {
        try {
            import(path.join(eventsPath, file)).then(async fileData => {
                fileData.default(client, config);
            });
            console.log(`[Events-Handler] Loaded Event: ${file}`);
            filesCount++;
        } catch (err) {
            console.log(`[Events-Handler-Error] Error to Load: ${file} : ERROR : ${err}`);
        }
    });

    console.log(`[Events-Handler] Loaded Successful: ${filesCount}`);
};

export default EventHander;
