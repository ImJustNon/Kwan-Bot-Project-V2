import { Client, CommandInteraction, CommandInteractionOption, CommandInteractionOptionResolver, Interaction, InteractionResponse } from "discord.js";
import { ClientParams } from "./ClientTypes";

interface CommandCallbackFunctionParams {
    client: ClientParams;
    interaction: CommandInteraction;
    config?: any;
    commandConfig: CommandConfig
}
type CommandCallbackFunction = (params: CommandCallbackFunctionParams) => Promise<void> | Promise<any>;


interface CommandConfig {
    name: string
    description: string
    type: number
    options: object[]
    userPermissions: string[] | null
    developersOnly: boolean
    ownerOnly: boolean
    category: string
    callback: CommandCallbackFunction
}

export {
    CommandCallbackFunction,
    CommandCallbackFunctionParams,
    CommandConfig
}