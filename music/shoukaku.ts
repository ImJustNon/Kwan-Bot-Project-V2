import { Client } from 'discord.js';
import { Shoukaku, Connectors } from 'shoukaku';
import { ClientParams } from '../types/ClientTypes';
import config from '../config/config';

let shoukaku: any = null;

function StartNode(client: ClientParams): void {
    shoukaku = new Shoukaku(new Connectors.DiscordJS(client), config.nodes, {
        moveOnDisconnect: false,
        resume: true,
        resumeTimeout: 30,
        reconnectTries: 5,
        restTimeout: 10000
    }) as Shoukaku;
}



export {
    shoukaku
}
export default StartNode;