import { ButtonInteraction, ChannelType, CommandInteraction, EmbedBuilder, GuildMember, Interaction, Message, TextChannel, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { ClientParams } from "../../../types/ClientTypes";
import { Prisma, PrismaClient } from "@prisma/client";
import { poru } from "../../../music/poruPlayer";
import { Player, Response, Track } from "poru";
import trackEmbed from "../utils/trackEmbed";
import queueMessage from "../utils/queueMessage";

const prisma: PrismaClient = new PrismaClient(); 

async function InteractionCreateEvent(client: ClientParams){
    client.on("messageCreate", async(message: Message) => {
        if(message.author.bot || message.author.username === client.user?.username) return; // ignore message from bot
        if(!message.guild) return // ingore direct message

        // first check if channel name have follow keyword
        const textChannel: TextChannel = message.channel as TextChannel;
        if(!textChannel.name.includes("music") && !textChannel.name.includes(`${client.user?.username}-music`) && !textChannel.name.includes(`${client.user?.username}`)) return;

        // then check from database
        const isMusicChannel = await prisma.guildMusicChannel.findUnique({
            where: {
                guild_id: message.guild.id,
                channel_id: message.channel.id
            },
            select: {
                content_banner_id: true,
                content_playing_id: true,
                content_queue_id: true
            }
        });
        if(!isMusicChannel) return;

        const messageContent: string = message.content;

        setTimeout(async(): Promise<void> =>{
            await message.delete();
        }, 1000);


        // find content data
        const bannerContent: Message = await textChannel.messages.fetch(isMusicChannel.content_banner_id);
        const queueContent: Message = await textChannel.messages.fetch(isMusicChannel.content_queue_id);
        const trackContent: Message = await textChannel.messages.fetch(isMusicChannel.content_playing_id);
        const memberVoiceChannel: VoiceBasedChannel | null | undefined = message.member?.voice.channel;

        if(!trackContent || !queueContent || !bannerContent){
            return await message.channel.send('🔴 | โครงสร้างข้อความในช่องนี้ เกิดข้อผิดพลาด').then((msg: Message) =>{
                setTimeout(async(): Promise<void> =>{
                    await msg.delete();
                }, 5000);
            });
        } 
        if(!memberVoiceChannel){  
            return await message.channel.send('🟡 | โปรดเข้าช่องเสียงก่อนเปิดเพลงน่ะ').then((msg: Message) =>{
                setTimeout(async(): Promise<void> =>{
                    await msg.delete();
                }, 5000);
            });
        }
        if(message.guild.members.me?.voice.channel && !memberVoiceChannel.equals(message.guild.members.me.voice.channel)){
            return await message.channel.send('🟡 | เอ๊ะ! ดูเหมือนว่าคุณจะไม่ได้อยู่ในช่องเสียงเดียวกันน่ะ').then((msg: Message) =>{
                setTimeout(async(): Promise<void> =>{
                    await msg.delete();
                }, 5000);
            });
        }

        // check for player. if player doesnot exit it will create one
        let player: Player | undefined = poru.players.get(message.guild.id);
        if(!player){
            player = poru.createConnection({
                guildId: message.guild.id,
                voiceChannel: memberVoiceChannel.id,
                textChannel: message.channel.id,
                deaf: true,
            }) as Player;
        }
        
        // search for music
        const result: Response = await poru.resolve({
            query: messageContent,
            source: "ytsearch",
            requester: message.member
        });

        // load error or cannot find result
        if (result.loadType === "error") {
            return await message.channel.send(`🔴 | ไม่สามารถค้นหาได้`).then((msg: Message) =>{
                setTimeout(async(): Promise<void> =>{
                    await msg.delete();
                }, 5000);
            });
        } 
        else if (result.loadType === "empty") {
            return await message.channel.send(`🟡 | ไม่พบผลการค้นหาสำหรับ ${messageContent}`).then((msg: Message) =>{
                setTimeout(async(): Promise<void> =>{
                    await msg.delete();
                }, 5000);
            });
        }

        // load type switch
        if(result.loadType === "playlist"){  // for playlist mode
            for(let track of result.tracks){
                player.queue.add(track);
            }
            await message.channel.send(`🟢 | เพิ่ม \`${result.tracks.length}\` รายการ จาก Playlist: \`${result.playlistInfo.name}\` เรียบร้อยเเล้ว`).then((msg: Message) =>{
                setTimeout(async(): Promise<void> =>{
                    await msg.delete();
                }, 5000);
            });
        }
        else { // for one song
            player.queue.add(result.tracks[0]);
            await message.channel.send(`🟢 | เพิ่ม \`${result.tracks[0].info.title}\` เรียบร้อยเเล้ว`).then((msg: Message) =>{
                setTimeout(async(): Promise<void> =>{
                    await msg.delete();
                }, 5000);
            });
        }

        if(!player.isPlaying && !player.isPaused){
            await player.play();
        }

        await queueContent.edit({
            content: await queueMessage(client, player),
        });
    });
}

export default InteractionCreateEvent;