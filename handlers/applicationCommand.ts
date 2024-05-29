import fs from "fs";
import { Client, REST } from "discord.js";
import { Routes } from "discord.js";
import path from "path";
import { ClientParams } from "../types/ClientTypes";
import config from "../config/config";

async function ApplicationCommandHandler(client: any): Promise<void> {
    let commands: Array<object> = [];
    let filesCount: number = 0;

    const findCommandFolder: Array<string> = fs.readdirSync(path.join(__dirname, "../commands"));
    findCommandFolder.forEach(async(foldername: string) =>{
        const findFileInsideCommandFolder = fs.readdirSync(path.join(__dirname, "../commands", foldername));

        for(const file of findFileInsideCommandFolder){
            const filePath = path.join(__dirname, "../commands", foldername, file);
            let pulled = await import(filePath);
            if (pulled.default.name && pulled.default.type) {
                console.log(`[Commands-Handler] Loaded : ${foldername}/${file}`);
                filesCount++;
                    
                if (pulled.default.description) {
                    commands.push({
                        name: pulled.default.name,
                        description: pulled.default.description,
                        type: 1,
                        options: pulled.default.options ? pulled.default.options : [],
                        default_permission: null,
                        default_member_permissions: null,
                        nsfw: false
                    });
                } else {
                    commands.push({
                        name: pulled.default.name,
                        type: pulled.default.type
                    });
                };

                client.commands.set(pulled.default.name, pulled.default);
            } else {
                console.log('[Commands-Handler-Error] Received empty property \'name\' or \'type\' in ' + file + '.')
                continue;
            };
        }
    });
    
    console.log(`[Commands-Handler] Loaded Successfully: ${filesCount}`);

    const rest: REST = new REST({ version: '10' }).setToken(config.client.token);

    try {
        await rest.put(Routes.applicationCommands(config.client.id), { 
            body: commands 
        });

        console.log('[Commands-Handler] Successfully registered application commands.');
    } catch (error) {
        console.error('[Commands-Handler] Failed to register application commands:', error);
    }
}

export default ApplicationCommandHandler;