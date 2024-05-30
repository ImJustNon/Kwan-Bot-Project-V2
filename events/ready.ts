import { Client, PresenceStatusData, ActivityType, PresenceUpdateStatus } from "discord.js";
import path from "path";
import { ClientParams } from "../types/ClientTypes";
import { poru } from "../music/poruPlayer";


function ReadyEvent(client: ClientParams, config: any):void {
    client.on('ready', async () => {
        console.log(`> Logged in as : ${client.user?.username} #${client.user?.discriminator}`);
    
        changeStatus();
        setInterval(() => {
            changeStatus();
            setInterval(() =>{
                changeStatus2();
            }, 5 * 1000);
        }, 5 * 1000);

        // init poru
        await poru?.init();

        const serverPath = path.join(__dirname, "../api", "app.ts");
        await import(serverPath);
    });
    
    async function changeStatus(): Promise<void> {
        try {
            client.user?.setPresence({
                activities: [{
                    name: `/help | ${client.guilds.cache.size} เซิฟเวอร์`,
                    type: ActivityType.Streaming,
                    url: "https://www.twitch.tv/im_just_non",
                }],
                status: PresenceUpdateStatus.Online,
            });
        } catch (e) {
            client.user?.setPresence({
                activities: [{
                    name: `/help | ${client.guilds.cache.size} เซิฟเวอร์`,
                    type: ActivityType.Streaming,
                    url: "https://www.twitch.tv/im_just_non",
                }],
                status: PresenceUpdateStatus.Online,
            });
        }
    }
    async function changeStatus2(): Promise<void> {
        try {
            client.user?.setPresence({
                activities: [{
                    name: `V.2.0.0 | Comming Soon...`,
                    type: ActivityType.Streaming,
                    url: "https://www.twitch.tv/im_just_non",
                }],
                status: PresenceUpdateStatus.Online
            });
        } catch (e) {
            client.user?.setPresence({
                activities: [{
                    name: `V.2.0.0 | Comming Soon...`,
                    type: ActivityType.Streaming,
                    url: "https://www.twitch.tv/im_just_non",
                }],
                status: PresenceUpdateStatus.Online
            });
        }
    }
}

export default ReadyEvent;
