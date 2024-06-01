import { ButtonInteraction, ChannelType, CommandInteraction, EmbedBuilder, GuildMember, Interaction, TextChannel, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { ClientParams } from "../../../types/ClientTypes";
import { Prisma, PrismaClient } from "@prisma/client";
import { poru } from "../../../music/poruPlayer";
import { Player } from "poru";
import trackEmbed from "../utils/trackEmbed";
import queueMessage from "../utils/queueMessage";


const prisma: PrismaClient = new PrismaClient(); 

async function InteractionCreateEvent(client: ClientParams){
    client.on("interactionCreate", async(interaction: Interaction) =>{
        // create commandInteraction for save interaction but in CommandInteraction Type
        const commandInteraction: CommandInteraction = interaction as CommandInteraction;

        // check is button interaction 
        if(!interaction.isButton) return;

        // filter channel from name
        if(!(interaction.channel instanceof TextChannel)) return;
        if(!interaction.channel.name.includes("music") && !interaction.channel.name.includes(`${client.user?.username}-music`) && !interaction.channel.name.includes(`${client.user?.username}`)) return;

        
        // check channel from database
        const getMusicChannelData = await prisma.guildMusicChannel.findUnique({
            where: {
                guild_id: interaction.guild?.id,
                channel_id: interaction.channel?.id
            },
            select: {
                content_banner_id: true,
                content_playing_id: true,
                content_queue_id: true
            }
        });
        if(!getMusicChannelData) return;

        

        // check player is still playing?
        const player: Player | undefined = poru.players.get(interaction.guild!.id);
        if(!player || !player.queue){
            return commandInteraction.reply({
                content: '🟡 | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ',
                ephemeral: true,
            });
        }

        // check is user connect voice channel?
        const member: GuildMember = interaction.member as GuildMember;
        const voiceChannel: VoiceBasedChannel | null = member.voice.channel;
        if(!voiceChannel){
            return commandInteraction.reply({
                content: '🟡 | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ',
                ephemeral: true,
            });
        }

        // check if bot is in use by another channel
        const bot: GuildMember | undefined = interaction.guild?.members.cache.get(client.user!.id);
        if(bot?.voice.channel && !voiceChannel.equals(bot.voice.channel)){
            return member.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('🔴 | ตอนนี้มีคนกำลังใช้งานอยู่น่ะ')
                        .setColor("Red")
                        .setFooter({ 
                            text: client.user!.username 
                        })
                        .setTimestamp(),
                ],
            }).then(async msg =>{
                await msg.react('🚫').catch(err => console.log(err));
                setTimeout(async() =>{
                    await msg.delete();
                }, 15000);
            });
        }

        // create buttonInteraction for save interaction but in buttonInteraction Type
        const buttonInteraction: ButtonInteraction = interaction as ButtonInteraction;
        // find trackContent message and queueContent message from id
        const trackContent = await interaction.channel.messages.fetch(getMusicChannelData.content_playing_id);
        const queueContent = await interaction.channel.messages.fetch(getMusicChannelData.content_queue_id);


        console.log(buttonInteraction.customId);
        if(buttonInteraction.customId === 'music_pause'){
            if(!player.isPaused){
                await player.pause(true);
                await commandInteraction.reply('🟢 | ทำการหยุดเพลงชั่วคราวเรียบร้อยเเล้วค่ะ').then(async(): Promise<void> => { 
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000);
                });
            }
            else if(player.isPaused){
                await player.pause(false);
                await commandInteraction.reply('🟢 | ทำการเล่นเพลงต่อเเล้วค่ะ').then(async(): Promise<void> => { 
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            } 
        }
        else if(buttonInteraction.customId === 'music_skip'){
            await player.skip();
            await commandInteraction.reply('🟢 | ทำการข้ามเพลงให้เรียบร้อยเเล้วค่ะ').then(async(): Promise<void> => { 
                setTimeout(async() =>{
                    await commandInteraction.deleteReply();
                }, 5000); 
            });
        }
        else if(buttonInteraction.customId === 'music_stop'){
            if(player.isPlaying){
                player.destroy();
                await commandInteraction.reply('🟢 | ทำการปิดเพลงเรียบร้อยเเล้วค่ะ').then(async(): Promise<void> => { 
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
        }
        else if(buttonInteraction.customId === 'music_loop'){
            if(player.loop === "NONE"){
                player.setLoop("QUEUE");
                await commandInteraction.reply(`🟢 | ทำการเปิดการวนซ้ำเพลงเเบบ \`ทั้งหมด\` เรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                    await trackContent.edit({ 
                        embeds: [await trackEmbed(client, player)]
                    });
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
            else if(player.loop === "QUEUE"){
                player.setLoop("TRACK");
                await commandInteraction.reply(`🟢 | ทำการเปิดการวนซ้ำเพลงเเบบ \`เพลงเดียว\` เรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                    await trackContent.edit({ 
                        embeds: [await trackEmbed(client, player)]
                    });
                    setTimeout(async() =>{
                    await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
            else if(player.loop === "TRACK"){
                player.setLoop("NONE");
                await commandInteraction.reply(`🟢 | ทำการปิดวนซ้ำเพลงเรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                    await trackContent.edit({
                        embeds: [await trackEmbed(client, player)]
                    });
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
        }
        else if(buttonInteraction.customId === 'music_shuffle'){
            if(!player.queue || !player.queue.length || player.queue.length == 0){
                await commandInteraction.reply('🟡 | เอ๊ะ! ดูเหมือนว่าคิวของคุณจะไม่มีความยาวมากพอน่ะคะ').then(async(): Promise<void> =>{ 
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
            else{
                player.queue.shuffle();
                await commandInteraction.reply('🟢 | ทำการสุ่มเรียงรายการคิวใหม่เรียบร้อยเเล้วค่ะ').then(async(): Promise<void> =>{ 
                    await queueContent.edit({ content: await queueMessage(client, player)});
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
        }
        else if(buttonInteraction.customId === 'music_volup'){
            let newVol: number = player.volume + 10;
            if(newVol < 110){
                await player.setVolume(newVol);
                await commandInteraction.reply(`🟢 | ทำการปรับความดังเสียงเป็น \`${newVol}\` เรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                    await trackContent.edit({ embeds: [ await trackEmbed(client, player) ]});
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
            else if(newVol >= 110){
                await commandInteraction.reply(`🟡 | ไม่สามารถปรับความดังเสียงได้มากกว่านี้เเล้วค่ะ`).then(async(): Promise<void> =>{ 
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
        }
        else if(buttonInteraction.customId === 'music_voldown'){
            let newVol: number = player.volume - 10;
            if(newVol > 0){
                await player.setVolume(newVol);
                await commandInteraction.reply(`🟢 | ทำการปรับความดังเสียงเป็น \`${newVol}\` เรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                    await trackContent.edit({ embeds: [ await trackEmbed(client, player) ]});
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }   
            else if(newVol < 0){
                await commandInteraction.reply(`🟡 | ไม่สามารถปรับความดังเสียงได้น้อยกว่านี้เเล้วค่ะ`).then(async(): Promise<void> =>{ 
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            } 
        }
        else if(buttonInteraction.customId === 'music_mute'){
            if(player.volume > 0){
                player.setVolume(0);
                await commandInteraction.reply(`🟢 | ทำการปิดเสียงเรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                    await trackContent.edit({ embeds: [ await trackEmbed(client, player) ]});
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
            else if(player.volume === 0){
                player.setVolume(80);
                await commandInteraction.reply(`🟢 | ทำการเปิดเสียงเรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                    await trackContent.edit({ embeds: [ await trackEmbed(client, player) ]});
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
        }
    });
}

export default InteractionCreateEvent;