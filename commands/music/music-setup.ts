import { Guild, GuildChannel, GuildMember, InteractionResponse, InteractionResponseType, InteractionType, Options, PermissionsBitField, ChannelType, Message} from "discord.js";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { CommandCallbackFunction, CommandCallbackFunctionParams, CommandConfig } from "../../types/CommandTypes";
import { poru } from "../../music/poruPlayer";
import { Player, supportedPlatforms, Track } from "poru";
import { Prisma, PrismaClient } from "@prisma/client";
import config from "../../config/config";

const prisma: PrismaClient = new PrismaClient();

const musicSetupCommand: CommandConfig = {
    name: 'music-setup',
    description: 'สร้างช่องสำหรับส่ง เเค่ชื่อเพลงก็ฟังได้ในทันที',
    type: 1,
    options: [],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    developersOnly: false,
    ownerOnly: false,
    category: 'music',
    callback: async({ client, interaction }: CommandCallbackFunctionParams): Promise<any> => {
        await interaction.reply({
            content: "⌛ | กำลังตั้งค่าห้องเล่นเพลง กรุณารอซักครู่น่ะ",
        });
        
        try {
            const guildId: string | undefined = interaction.guild?.id;
            const findCurrentData = await prisma.guildMusicChannel.findUnique({
                where: {
                    guild_id: guildId
                }
            });

            if(findCurrentData){
                return interaction.followUp({
                    content: "🟡 | เซิฟเวอร์นี้ได้่สร้างช่องไว้เเล้ว หากต้องการสร้างใหม่ให้ทำการลบด้วยคำสั่ง `/music-remove`",
                });
            }

            await CreateChannelAndSetupMessage();
            await interaction.editReply("🟢 | ทำการตั้งค่า เรียบร้อยเเล้ว");
            async function CreateChannelAndSetupMessage(): Promise<void> {
                await interaction.guild?.channels.create({
                    name: `${client.user?.username}-music`,
                    type: ChannelType.GuildText,
                    parent: null,
                }).then(async(ch: TextChannel) =>{
                    const channelId: string = ch.id;
                    const authorId: string | undefined= interaction.member?.user.id;
                    const guildId: string | undefined = interaction.guild?.id;

                    await ch.setTopic(`play_pause: | หยุดเพลง หรือ เล่นเพลงต่อ :track_next: | ข้ามเพลง :stop_button: | ปิดเพลง :repeat: | เปิด/ปิด การใช้งานวนซ้ำ :twisted_rightwards_arrows: | สลับคิวเพลง :sound: | ลดเสียง :loud_sound: | เพิ่มเสียง :speaker: | ปิด/เปิดเสียง`);

                    let contentBannerId: string = "";
                    let contentqueueId: string = "";
                    let contentCurrentId: string = "";

                    await ch.send({
                        content: config.assets.musicChannel.bannerUrl,
                    }).then((msg: Message) => contentBannerId = msg.id);
                    await ch.send({
                        content: "**คิวเพลง:** \nเข้าช่องเสียง และพิมพ์ชื่อเพลงหรือลิงก์ของเพลง เพื่อเปิดเพลงน่ะ "
                    }).then((msg: Message) => contentqueueId = msg.id);
                    await ch.send({
                        embeds: [
                            new EmbedBuilder().setColor(config.assets.musicChannel.defaultColor).setTitle("ยังไม่มีเพลงเล่นอยู่ ณ ตอนนี้").setImage(config.assets.musicChannel.defaultUrl).setFooter({ text: "ใช้ /help สำหรับคำสั่งเพิ่มเติม" }).setTimestamp(),
                        ],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder().setCustomId(`music_pause`).setStyle(ButtonStyle.Success).setEmoji(`⏯`),
                                new ButtonBuilder().setCustomId(`music_skip`).setStyle(ButtonStyle.Secondary).setEmoji(`⏭`),
                                new ButtonBuilder().setCustomId(`music_stop`).setStyle(ButtonStyle.Danger).setEmoji(`⏹`),
                                new ButtonBuilder().setCustomId(`music_loop`).setStyle(ButtonStyle.Secondary).setEmoji(`🔁`),
                                new ButtonBuilder().setCustomId(`music_shuffle`).setStyle(ButtonStyle.Success).setEmoji(`🔀`),
                            ), 
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder().setCustomId(`music_volup`).setLabel(`เพิ่มเสียง`).setStyle(ButtonStyle.Primary).setEmoji(`🔊`),
                                new ButtonBuilder().setCustomId(`music_voldown`).setLabel(`ลดเสียง`).setStyle(ButtonStyle.Primary).setEmoji(`🔉`),
                                new ButtonBuilder().setCustomId(`music_mute`).setLabel(`ปิด/เปิดเสียง`).setStyle(ButtonStyle.Primary).setEmoji(`🔈`),
                            ),
                        ],
                    }).then((msg: Message) => contentCurrentId = msg.id);

                    await prisma.guildMusicChannel.create({
                        data: {
                            guild_id: interaction.guild?.id as string,
                            channel_id: interaction.channel?.id as string,
                            author_id: interaction.user.id,
                            content_banner_id: contentBannerId,
                            content_queue_id: contentqueueId,
                            content_playing_id: contentCurrentId
                        }
                    }).catch(e =>{
                        return interaction.followUp({
                            content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้",
                        });
                    });
                });
            }
        }
        catch(e){
            console.log(e);
            return interaction.followUp({
                content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้"
            });
        }
        

        // console.log(findCurrentData)
    }
};

export default musicSetupCommand;