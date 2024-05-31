import { Guild, GuildChannel, GuildMember, InteractionResponse } from "discord.js";
import { CommandCallbackFunction, CommandCallbackFunctionParams, CommandConfig } from "../../types/CommandTypes";
import { poru } from "../../music/poruPlayer";
import { Player, supportedPlatforms, Track } from "poru";

const pingCommand: CommandConfig = {
    name: 'play',
    description: 'เปิดเพลงฟังในดิสคิอร์ดชิวๆ เย่ๆ',
    type: 1,
    options: [
        {
            name: 'search',
            description: 'พิมพ์สิ้งที่ต้องการค้นหา หรือ ลิ้งค์',
            type: 3,
            required: true,
        },
        {
            name: 'platform',
            description: 'เเหล่งที่มา เช่น Youtube',
            type: 3,
            choices: [
                {
                    name: "Youtube",
                    value: 'ytsearch',
                },
                {
                    name: "Spotify",
                    value: 'spsearch',
                }
            ],
            required: false,
        },
    ],
    userPermissions: null,
    developersOnly: false,
    ownerOnly: false,
    category: 'music',
    callback: async({ client, interaction, config }: CommandCallbackFunctionParams): Promise<any> => {
        const query: any = interaction.options.get('search')?.value;
        const source: any = interaction.options.get('platform')?.value;
        const guild = client.guilds.cache.get(interaction.guildId ?? "") as Guild;
        const member = guild?.members.cache.get(interaction.member?.user.id ?? "") as GuildMember;
        const channel = member?.voice.channel as GuildChannel;

        const me = guild.members.cache.get(client.user?.id ?? "") as GuildMember;

        if(!channel){
            return interaction.reply('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        }
        if(me.voice.channel && !channel.equals(me.voice.channel)){
            return interaction.reply('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
        } 
        if(!query){
            return interaction.reply('⚠ | โปรดระบุเพลงที่ต้องการด้วยน่ะ');
        } 

        const res = await poru?.resolve({
            query: query, 
            source: source ?? "ytsearch", 
            requester: interaction.member 
        });

        console.log(res)

        if (res?.loadType === "error") {
            return interaction.reply("Failed to load track.");
        } else if (res?.loadType === "empty") {
            return interaction.reply("No source found!");
        }

        const player: Player = poru?.createConnection({
            guildId: guild.id,
            voiceChannel: channel.id,
            textChannel: interaction.channelId,
            deaf: true,
        }) as Player;

        if (res?.loadType === "playlist") {
            for (const track of res?.tracks) {
                track.info.requester = interaction.user;
                player?.queue.add(track);
            }
    
            await interaction.reply(`${res?.playlistInfo.name} has been loaded with ${res?.tracks.length}`);
        } else {
            const track: Track = res?.tracks[0] as Track;
            track.info.requester = interaction.user;
            player?.queue.add(track);
            await interaction.reply(`Queued Track \n \`${track.info.title}\``);
        }

        if (!player?.isPlaying && player?.isConnected) player?.play();
    }
};

export default pingCommand;