import { EmbedBuilder } from "discord.js";
import config from "../../../config/config";
import { ClientParams } from "../../../types/ClientTypes";
import { Player } from "poru";
import { convertTime } from "../../../utils/convertTime";


async function trackEmbed(client: ClientParams, player: Player): Promise<EmbedBuilder> {
    let loopType: string = 'ปิด';
    if(player.loop === "TRACK") loopType = 'เพลงเดียว';
    else if(player.loop === "QUEUE") loopType = 'ทั้งหมด'; 


    const embed = new EmbedBuilder()
        .setColor(config.assets.musicChannel.defaultColor)
        .setTitle(`${player.currentTrack?.info.title}`)
        .setURL(`${player.currentTrack?.info.uri}`)
        .addFields([
            {
                name: "📫 | เปิดโดย",
                value: `${player.currentTrack?.info.requester}`,
                inline: true,
            },
            {
                name: "🔄 | Loop",
                value: `\` ${loopType} \``,
                inline: true,
            },
            {
                name: "🔊 | Volume",
                value: `\` ${player.volume === 0 ? "ปิดเสียง" : player.volume} \``,
                inline: true,
            },
            {
                name: "🚪 | ช่อง",
                value: `<#${player.textChannel}>`,
                inline: true,
            },
            {
                name: "🌍 | Creator",
                value: `\` ${player.currentTrack?.info.author} \``,
                inline: true,
            },
            {
                name: "⏳ | เวลา",
                value: `\` ${convertTime(player.currentTrack?.info.length ?? 0)} \``,
                inline: true,
            },
        ])
        .setImage(`${player.currentTrack?.info.artworkUrl}`)
        .setFooter({ 
            text: `${client.user?.username}`
        })
        .setTimestamp();
    return embed;
}


export default trackEmbed;