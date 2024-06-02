import { Player, Track } from "poru";
import { ClientParams } from "../../types/ClientTypes";
import { poru } from "../poruPlayer";
import { Prisma, PrismaClient } from "@prisma/client";
import { defaultTrackEmbed, defaultQueueMessage } from "../../features/music_channel/utils/musicChannelDefaultData";
import queueMessage from "../../features/music_channel/utils/queueMessage";
import trackEmbed from "../../features/music_channel/utils/trackEmbed";
import { Channel, EmbedBuilder, Guild, GuildChannel, GuildTextChannelType, Message, TextChannel, VoiceChannel } from "discord.js";

const prisma: PrismaClient = new PrismaClient();

function PlayerEvent(client: ClientParams): void {
    poru?.on("playerCreate", async(player: Player): Promise<void> =>{
        await player.setVolume(80);
    });
    poru?.on("playerUpdate", (player: Player) =>{
        // console.log("playerUpdate");
    });
    poru?.on("playerDestroy", async(player: Player): Promise<void> =>{
        // set to default data when player got destroy
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


export default PlayerEvent;