import { Node, Player } from "poru";
import { ClientParams } from "../../types/ClientTypes";
import { poru } from "../poruPlayer";
import { Collection, GuildBasedChannel, GuildMember, VoiceState } from "discord.js";

function GuildEvent(client: ClientParams): void {
    // when disconnect
    client.on("voiceStateUpdate", async(oldState: VoiceState, newState: VoiceState) =>{
        const player: Player | undefined = poru.players.get(newState.guild.id);

        if(player){
            if (oldState.channelId === null || typeof oldState.channelId == 'undefined') return;
            if (newState.id !== client.user?.id) return;

            await player.destroy();
        }   
    });

    // when guild channel empty
    client.on("voiceStateUpdate", async (oldMember: VoiceState, newMember: VoiceState) =>{
        const player: Player | undefined = poru.players.get(newMember.guild.id);

        if(player){
            const voiceChannel: GuildBasedChannel | undefined = newMember.guild.channels.cache.get(player.voiceChannel);
            const textChannel: GuildBasedChannel | undefined = newMember.guild.channels.cache.get(player.textChannel);
            const members = voiceChannel?.members as Collection<string, GuildMember>;

            if(player.isPlaying && members.size < 2){
                await player.destroy();
                // if(!player.paused){
                //     player.pause(true);
                //     textChannel.send({
                //         embeds: [new EmbedBuilder().setColor("Random").setTitle(`⏸️ | กำลังหยุดชั่วคราว`)],
                //     });
                // }
            }
            // else {
            //     if(player.paused){
            //         player.pause(false);
            //         textChannel.send({
            //             embeds: [new EmbedBuilder().setColor("Random").setTitle(`⏯️ | กำลังเล่นต่อจากเดิม`)],
            //         });
            //     }
            // }
        } 
    });
}

export default GuildEvent;