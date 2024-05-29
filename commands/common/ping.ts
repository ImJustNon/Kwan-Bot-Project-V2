import { InteractionResponse } from "discord.js";
import { CommandCallbackFunction, CommandCallbackFunctionParams, CommandConfig } from "../../types/CommandTypes";


const pingCommand: CommandConfig = {
    name: 'ping',
    description: 'เช็ค Ping บอท',
    type: 1,
    options: [],
    userPermissions: null,
    developersOnly: false,
    ownerOnly: false,
    category: 'common',
    callback: async(params: CommandCallbackFunctionParams): Promise<any> => {
        const { client, interaction, config } = params;
        console.log(interaction.member);
        return interaction.reply({
            content: '`🏓` Pong! Lantency: ' + client.ws.ping + 'ms'
        });
    }
};

export default pingCommand;