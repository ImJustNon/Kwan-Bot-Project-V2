import config from "../config/config";
import { Client, Interaction, InteractionType } from "discord.js";
import { CommandConfig } from "../types/CommandTypes";
import { ClientParams } from "../types/ClientTypes";

async function InteractionCreateEvent(client: any): Promise<void>{
    client.on('interactionCreate', async (interaction: Interaction)  => {
        if(interaction.isChatInputCommand()){
            const command: CommandConfig = await client.commands.get(interaction.commandName);
            
            if(!command){
                return interaction.reply({
                    content: `❌ ไม่พบคำสั่งนี้ โปรดลองใหม่ในภายหลังน่ะ`,
                    ephemeral: true,
                });
            }

            try{  
                if (command.ownerOnly && command.ownerOnly === true) {
                    if (config.users.owners.includes(interaction.user.id)) {
                        return interaction.reply({
                            content: `❌ | คำสั่งนี้สามารถสำหรับ Owner เท่านั้น`,
                            ephemeral: true,
                        });
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

                // if (command.userPermissions && command.userPermissions !== null) {
                //     if (Array.isArray(command.userPermissions)) {
                //         if (command.userPermissions.length > 0) {
                //             const checkPerms = interaction.member?.permissions.has(command.userPermissions);
                //             if (!checkPerms){
                //                 return interaction.reply({
                //                     content: `❌ | คุณไม่มีสิทธิใช้คำสั่งนี้น่ะ`,
                //                     ephemeral: true,
                //                 });
                //             }
                //         }
                //     }
                // }

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
    });
}

export default InteractionCreateEvent;