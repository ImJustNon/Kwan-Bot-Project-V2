import { EmbedBuilder } from "discord.js";
import { ClientParams } from "../../../types/ClientTypes";
import { Player } from "poru";
import config from "../../../config/config";

function defaultTrackEmbed(client: ClientParams, player: Player): EmbedBuilder {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setColor(config.assets.musicChannel.defaultColor)
        .setTitle('ยังไม่มีเพลงเล่นอยู่ ณ ตอนนี้')
        .setImage(`${config.assets.musicChannel.defaultUrl}`)
        .setFooter({ 
            text: `ใช้ /help สำหรับคำสั่งเพิ่มเติม`
        })
        .setTimestamp();
    return embed;
}

function defaultQueueMessage(client: ClientParams, player: Player): string {
    return '**คิวเพลง:**\nเข้าช่องเสียง และพิมพ์ชื่อเพลงหรือลิงก์ของเพลง เพื่อเปิดเพลงน่ะ';
}

export {
    defaultTrackEmbed,
    defaultQueueMessage
};