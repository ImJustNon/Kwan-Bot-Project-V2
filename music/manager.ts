import { Client } from 'discord.js';
import { Shoukaku, Connectors } from 'shoukaku';
import { ClientParams } from '../types/ClientTypes';

let manager: any = null;

function StartNode(client: ClientParams): void {
    manager = new Shoukaku(new Connectors.DiscordJS(client), [
        {
            name: "Localhost",
            url: "localhost:23933",
            auth: "reirin",
        },
    ], {
        moveOnDisconnect: false,
        resume: true,
        resumeTimeout: 30,
        reconnectTries: 5,
        restTimeout: 10000
    });
}



export {
    manager
}
export default StartNode;