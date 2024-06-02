import config from "../config/config";
import { Channel, Client, Interaction, InteractionType, PermissionsBitField, TextBasedChannel, TextChannel } from "discord.js";
import { CommandConfig } from "../types/CommandTypes";
import { ClientParams } from "../types/ClientTypes";
import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma: PrismaClient = new PrismaClient();

async function InteractionCreateEvent(client: ClientParams): Promise<void>{
    client.on('interactionCreate', async (interaction: Interaction)  => {
        // guild interaction
        if(interaction.guild){
            if(interaction.isChatInputCommand()){ 
                const command: CommandConfig | undefined = client.commands.get(interaction.commandName);
                
                if(!command){
                    return interaction.reply({
                        content: `❌ ไม่พบคำสั่งนี้ โปรดลองใหม่ในภายหลังน่ะ`,
                        ephemeral: true,
                    });
                }

                try{   
                    if (command.ownerOnly && command.ownerOnly === true) {
                        if (config.users.owners && config.users.owners.length > 0) {
                            if (!config.users.owners.some((owner) => interaction.user.id === owner)) {
                                return interaction.reply({
                                    content: `❌ | คำสั่งนี้สามารถสำหรับ Owner เท่านั้น`,
                                    ephemeral: true,
                                });
                            }
                        }
                    }

                    if (command.developersOnly && command.developersOnly === true) {
                        if (config.users.developers && config.users.developers.length > 0) {
                            if (!config.users.developers.some((dev) => interaction.user.id === dev)) {
                                return interaction.reply({
                                    content: `❌ | คำสั่งนี้สามารถสำหรับ Developer เท่านั้น`,
                                    ephemeral: true,
                                });
                            }
                        }
                    }

                    if (command.userPermissions && Array.isArray(command.userPermissions) && command.userPermissions.length > 0) {
                        const memberPermissions: Readonly<PermissionsBitField> = interaction.member?.permissions as Readonly<PermissionsBitField>;
                        const requiredPermissions: PermissionsBitField = new PermissionsBitField(command.userPermissions);
                        const hasPermissions: boolean = memberPermissions?.has(requiredPermissions);
                        if (!hasPermissions) {
                            return interaction.reply({
                                content: `❌ | คุณไม่มีสิทธิใช้คำสั่งนี้น่ะ`,
                                ephemeral: true,
                            });
                        }
                    }

                    /// filter channel from name if not similar with music channel then ignore
                    const textChannel: TextChannel = client.channels.cache.get(interaction.channelId) as TextChannel;
                    if(textChannel.name.includes("music") || textChannel.name.includes(`${client.user?.username}-music`) || textChannel.name.includes(`${client.user?.username}`)) {
                        // check for if music channel will throw error 
                        const isMusicChannel = await prisma.guildMusicChannel.findUnique({
                            where: {
                                guild_id: interaction.guild.id,
                                channel_id: interaction.channelId
                            } ,
                            select: {
                                id: true
                            }
                        });
                        if(isMusicChannel) throw Error ;
                    }

                    await command.callback({client, interaction, config, commandConfig: command});
                }
                catch(e){
                    console.error(`[Error] Failed to run the command \'${interaction.commandName}\'. Error : ${e}`);
                    return interaction.reply({
                        content: `🔴 | ขณะนี้ไม่สามารถใช้คำสั่งนี้ได้ โปรดลองใหม่ในภายหลังน่ะ`,
                        ephemeral: true,
                    });
                }
                finally {
                    console.log(`[Alert] ${interaction.user.username} has used the command \'${interaction.commandName}\'.`);
                };
            }
            else if(interaction.isMessageContextMenuCommand()){
            }
            else if(interaction.isUserContextMenuCommand()){
            }
            else return;
        }
        else { // direct message interaction because it does not have guild id

        }
    });
}

export default InteractionCreateEvent;