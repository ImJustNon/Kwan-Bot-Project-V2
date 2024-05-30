import { InteractionResponse } from "discord.js";
import { CommandCallbackFunction, CommandCallbackFunctionParams, CommandConfig } from "../../types/CommandTypes";
import { shoukaku } from "../../music/shoukaku";

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
        return;
    }
};

export default pingCommand;