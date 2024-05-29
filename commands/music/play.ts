import { InteractionResponse } from "discord.js";
import { CommandCallbackFunction, CommandCallbackFunctionParams, CommandConfig } from "../../types/CommandTypes";
import { manager } from "../../music/manager";

const pingCommand: CommandConfig = {
    name: 'play',
    description: 'เช็ค Ping บอท',
    type: 1,
    options: [
        {
            name: 'search',
            description: 'พิมพ์สิ้งที่ต้องการค้นหา หรือ ลิ้งค์',
            type: 3,
            required: true,
        }
    ],
    userPermissions: null,
    developersOnly: false,
    ownerOnly: false,
    category: 'music',
    callback: async({ client, interaction, config }: CommandCallbackFunctionParams): Promise<any> => {
        const query = interaction.options.get("search");
        const guild = client.guilds.cache.get(interaction.guildId)
        const member = guild.members.cache.get(interaction.member?.user.id);
        const channel = member?.voice.channel;

        const me = guild.members.cache.get(client.user.id);
        if(!channel) return interaction.reply('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.reply('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
        if(!query) return interaction.reply('⚠ | โปรดระบุเพลงที่ต้องการด้วยน่ะ');

        // const player = await manager.joinVoiceChannel({
        //     guildId: interaction.guildId,
        //     channelId: interaction.channelId,
        //     shardId: 0, // if unsharded it will always be zero (depending on your library implementation)
        //   });
        //   // player is created, now search for a track
        //   const result = await player.node.rest.resolve("scsearch:snowhalation");
        //   if (!result?.data.length) return;
        //   const metadata = result.tracks.shift();
        //   // play the searched track
        //   await player.playTrack({ track: { encoded: metadata.encoded } });
        //   // wait for track to end
        // //   await once(player, 'end');
        //   // leaver the voice channel
        //   await manager.leaveVoiceChannel(player.guildId);
    }
};

export default pingCommand;