import { Client, PresenceStatusData, ActivityType } from "discord.js";
import path from "path";
import { ClientParams } from "../types/ClientTypes";


function ReadyEvent(client: ClientParams, config: any):void {
    client.on('ready', async () => {
        console.log(`> Logged in as : ${client.user?.username} #${client.user?.discriminator}`);
    
        changeStatus();
        setInterval(() => {
            changeStatus();
        }, 10 * 1000);

        const serverPath = path.join(__dirname, "../server", "app.ts");
        import(serverPath);
    });
    
    async function changeStatus() {
        try {
            client.user?.setPresence({
                activities: [{
                    name: `/help | ${client.guilds.cache.size} เซิฟเวอร์`,
                    type: ActivityType.Streaming,
                    url: "https://www.twitch.tv/im_just_non",
                }],
                status: 'online' as PresenceStatusData,
            });
        } catch (e) {
            client.user?.setPresence({
                activities: [{
                    name: `/help | ${client.guilds.cache.size} เซิฟเวอร์`,
                    type: ActivityType.Streaming,
                    url: "https://www.twitch.tv/im_just_non",
                }],
                status: 'online' as PresenceStatusData,
            });
        }
    }
}

export default ReadyEvent;
