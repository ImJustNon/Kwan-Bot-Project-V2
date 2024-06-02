import { Guild, GuildChannel, GuildMember, InteractionResponse, InteractionResponseType, InteractionType, Options, PermissionsBitField, ChannelType, Message, InteractionCollector, MappedInteractionTypes, ComponentType, Interaction, MessageComponentCollectorOptions, MessageChannelComponentCollectorOptions, Collector, MessageComponentInteraction, CollectorFilter, CommandInteraction, ButtonInteraction} from "discord.js";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { CommandCallbackFunction, CommandCallbackFunctionParams, CommandConfig } from "../../types/CommandTypes";
import { poru } from "../../music/poruPlayer";
import { Player, supportedPlatforms, Track } from "poru";
import { Prisma, PrismaClient } from "@prisma/client";
import config from "../../config/config";
import { Channel } from "diagnostics_channel";

const prisma: PrismaClient = new PrismaClient();

const musicSetupCommand: CommandConfig = {
    name: 'music-remove',
    description: 'ลบช่องสำหรับส่งเพลง',
    type: 1,
    options: [],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    developersOnly: false,
    ownerOnly: false,
    category: 'music_channel',
    callback: async({ client, interaction }: CommandCallbackFunctionParams): Promise<any> => {
        const findMusicChannel = await prisma.guildMusicChannel.findUnique({
            where: {
                guild_id: interaction.guild?.id,
            },
            select: {
                channel_id: true
            }
        });
        if(!findMusicChannel){
            return interaction.reply({
                content: `🟡 | เอ๊ะ! ไม่พบข้อมูลการตั้งค่าช่องเล่นเพลงเลยนะ`
            });
        }

        // create embed and button
        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(config.assets.musicChannel.defaultColor)
            .setTitle(`หากต้องการจะลบระบบห้องเพลงให้กด \`ยืนยัน\` \nหากต้องการยกเลิกให้กด \`ยกเลิก\``)
            .setFooter({
                text: client.user!.username
            })
            .setTimestamp();
        const yesBtn: ButtonBuilder = new ButtonBuilder()
            .setLabel(`ยืนยัน [Accept]`)
            .setCustomId(`yes`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`✅`);
        const noBtn: ButtonBuilder = new ButtonBuilder()
            .setLabel(`ยกเลิก [Cancel]`)
            .setCustomId(`no`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`❌`);
        const btnRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(yesBtn, noBtn);


        await interaction.reply({ 
            embeds: [embed], 
            components: [btnRow],
            ephemeral: true
        });
        const filter = (i: Interaction): i is ButtonInteraction => i.user.id === interaction.member?.user.id;
        const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 30000 });

        if(!collector) return interaction.deleteReply();
        collector.on('collect', async(i: ButtonInteraction) => {
            if (i.customId === 'yes'){
                const musicChannel: TextChannel | undefined = client.channels.cache.get(findMusicChannel.channel_id) as TextChannel | undefined;
                if(musicChannel){
                    await musicChannel.delete().catch((): void => {});
                }
                await prisma.guildMusicChannel.delete({
                    where: {
                        guild_id: interaction.guild?.id
                    }
                });
                return await i.update({ 
                    content: '🟢 | ทำการลบการตั้งค่าห้องระบบเพลงเรียบร้อยเเล้วค่ะ', 
                    embeds: [], 
                    components: [],
                });
            }
            else if(i.customId === 'no'){
                return await i.update({ 
                    content: '🟢 | ทำการยกเลิกรายการเรียบร้อยค่ะ', 
                    embeds: [], 
                    components: [] 
                });
            }
        });

    }
};

export default musicSetupCommand;