import { Client } from 'discord.js';
import { ClientParams } from '../types/ClientTypes';
import config from '../config/config';
import { Poru } from 'poru';

let poru: Poru | null = null;

async function PoruPlayer(client: ClientParams): Promise<void> {
    poru = new Poru(client, config.nodes, {
        library: "discord.js",
        defaultPlatform: "ytsearch",
        resumeKey: "nonlnwza",
        resumeTimeout: 60 * 1000,
        reconnectTries: 5
    }) as Poru;
}


export {
    poru
}
export default PoruPlayer;