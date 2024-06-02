import fs from 'fs';
import path from 'path';
import { Client } from 'discord.js';
import { CommandConfig } from '../types/CommandTypes';
import { ClientParams } from '../types/ClientTypes';
import config from "../config/config";

import MusicChannelMain from "../features/music_channel/main";

async function FeaturesLoaderHandler(client: ClientParams): Promise<void> {
    client.on("ready", async(): Promise<void> =>{
        try {
            await MusicChannelMain(client); 
            console.log(`[Feature-Loader] Load Sussessful`);
        }
        catch(e){
            console.log(`[Feature-Loader] Fail to Load`);
        }
        
    });
};

export default FeaturesLoaderHandler;
