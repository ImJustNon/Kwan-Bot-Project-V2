import { Socket } from "socket.io";
import { convertTime } from "../../../utils/convertTime";
import { poru } from "../../../music/poruPlayer";
import { Player } from "poru";


async function playerUpdateController(socket: Socket): Promise<void> {

    const { guildId } = socket.handshake.query ?? {};

    poru.on("playerUpdate", (player: Player) =>{
        if(!guildId) return; // is client send guild ?
        if(guildId !== player.guildId) return; // is equal to current event from poru's playerUpdate

        socket.emit("response", JSON.stringify({
            track: {
                previous: player.previousTrack,
                current: player.currentTrack,
                queue: player.queue,
            },
            guidId: player.guildId,
            voiceChannelId: player.voiceChannel,
            textChannelId: player.textChannel,
            isPlaying: player.isPlaying,
            isPaused: player.isPaused,
            isConnected: player.isConnected,
            loop: player.loop,
            position: player.position,
            parsedPosition: convertTime(player.position),
            ping: player.ping,
            timestamp: player.timestamp,
            mute: player.mute,
            deaf: player.deaf,
            volume: player.volume
        }));
    });

}


export default playerUpdateController;