import { Player, Track, TrackEndEvent, TrackExceptionEvent, TrackStuckEvent } from "poru";
import { ClientParams } from "../../types/ClientTypes";
import { poru } from "../poruPlayer";
import { Channel, EmbedBuilder, GuildChannel, GuildTextChannelType, TextChannel, VoiceChannel } from "discord.js";
import { convertTime } from "../../utils/convertTime";

function TrackEvent(client: ClientParams): void {

    poru?.on("trackStart", async(player: Player, track: Track): Promise<void>=>{
        const channel: TextChannel = client.channels.cache.get(player.textChannel) as TextChannel;
        const voice: VoiceChannel = client.channels.cache.get(player.voiceChannel) as VoiceChannel; 
        await channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setThumbnail(track.info.artworkUrl ?? null)
                .addFields(
                    [
                        {
                            name: `🎵 | กำลังเล่นเพลง`,
                            value: `[${track.info.title}](${track.info.uri})`, 
                            inline: false,
                        },
                        {
                            name: `🏡 | ในห้อง`,
                            value: `<#${voice.id}>`, 
                            inline: true,
                        },
                        {
                            name: `⏲️ | ความยาว`,
                            value: `\`${convertTime(track.info.length)}\``, 
                            inline: true,
                        },
                        {
                            name: `📥 | ขอเพลงโดย`,
                            value: `${track.info.requester}`, 
                            inline: true,
                        },
                    ],
                )
                .setFooter({text: client.user?.username ?? ""})
                .setTimestamp()
            ],
        });
    });
    poru?.on("trackEnd", async(player: Player, track: Track, data: TrackEndEvent): Promise<void> =>{
    });
    poru?.on("trackError", async(player: Player, track: Track, data: TrackStuckEvent | TrackExceptionEvent): Promise<void> =>{
    });
    poru?.on("queueEnd", async(player: Player): Promise<void> =>{
        const channel: TextChannel = client.channels.cache.get(player.textChannel) as TextChannel;
        const msg = await channel.send({ 
            embeds: [ 
                new EmbedBuilder()
                    .setColor("Random")
                    .setTitle('💤 | คิวหมดเเล้วน่ะ'),
            ] 
        });
        await player.destroy();
    });
}


export default TrackEvent;