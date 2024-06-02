import { Player, Track, TrackEndEvent, TrackExceptionEvent, TrackStuckEvent } from "poru";
import { ClientParams } from "../../types/ClientTypes";
import { poru } from "../poruPlayer";
import { Channel, EmbedBuilder, Guild, GuildChannel, GuildTextChannelType, Message, TextChannel, VoiceChannel } from "discord.js";
import { convertTime } from "../../utils/convertTime";
import { Prisma, PrismaClient } from "@prisma/client";
import { defaultTrackEmbed, defaultQueueMessage } from "../../features/music_channel/utils/musicChannelDefaultData";
import queueMessage from "../../features/music_channel/utils/queueMessage";
import trackEmbed from "../../features/music_channel/utils/trackEmbed";

const prisma: PrismaClient = new PrismaClient();

function TrackEvent(client: ClientParams): void {

    poru?.on("trackStart", async(player: Player, track: Track): Promise<void>=>{
        const channel: TextChannel = client.channels.cache.get(player.textChannel) as TextChannel;
        const voice: VoiceChannel = client.channels.cache.get(player.voiceChannel) as VoiceChannel; 

        const isMusicChannel = await prisma.guildMusicChannel.findUnique({
            where: {
                guild_id: player.guildId,
                channel_id: player.textChannel
            },
            select: {
                content_banner_id: true,
                content_queue_id: true,
                content_playing_id: true
            }
        });

        if(isMusicChannel){
            const bannerContent: Message = await channel.messages.fetch(isMusicChannel.content_banner_id);
            const queueContent: Message = await channel.messages.fetch(isMusicChannel.content_queue_id);
            const trackContent: Message = await channel.messages.fetch(isMusicChannel.content_playing_id);

            await queueContent.edit({ 
                content: await queueMessage(client, player),
            });
            await trackContent.edit({ 
                embeds: [ 
                    await trackEmbed(client, player),
                ] 
            });
        }
        else {
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
        }
    });
    poru?.on("trackError", async(player: Player, track: Track, data: TrackStuckEvent | TrackExceptionEvent): Promise<void> =>{
    });
    poru?.on("queueEnd", async(player: Player): Promise<void> =>{
        const channel: TextChannel = client.channels.cache.get(player.textChannel) as TextChannel;
        // const guild: Guild = client.guilds.cache.get(player.guildId) as Guild;
        try {
            const isMusicChannel = await prisma.guildMusicChannel.findUnique({
                where: {
                    guild_id: player.guildId,
                    channel_id: player.textChannel
                },
                select: {
                    id: true
                }
            });

            // send queue end message
            const msg: Message = await channel.send({ 
                embeds: [ 
                    new EmbedBuilder()
                        .setColor("Random")
                        .setTitle('💤 | คิวหมดเเล้วน่ะ'),
                ] 
            });

            // if send in music channel will remove after 5 sec.
            if(isMusicChannel){
                setTimeout(async() => {
                    await msg.delete();
                }, 5000);
            }
        }
        catch(e){
            console.log("[Error] ", e);
        }

        await player.destroy();
    });

    poru?.on("trackEnd", async(player: Player, track: Track, data: TrackEndEvent): Promise<void> =>{
        try {
            const isMusicChannel = await prisma.guildMusicChannel.findUnique({
                where: {
                    guild_id: player.guildId,
                    channel_id: player.textChannel
                },
                select: {
                    content_banner_id: true,
                    content_queue_id: true,
                    content_playing_id: true
                }
            });
    
            if(!isMusicChannel) return; // if isnt music channel will ignore
    
            const channel: TextChannel = client.channels.cache.get(player.textChannel) as TextChannel;
            const bannerContent: Message = await channel.messages.fetch(isMusicChannel.content_banner_id);
            const queueContent: Message = await channel.messages.fetch(isMusicChannel.content_queue_id);
            const trackContent: Message = await channel.messages.fetch(isMusicChannel.content_playing_id);
    
            await queueContent.edit({
                content: defaultQueueMessage(client, player),
            });
            await trackContent.edit({
                embeds: [
                    defaultTrackEmbed(client, player),
                ]
            });
        }
        catch(e){
            console.log(`[Error] `, e);
        }
    });
}


export default TrackEvent;