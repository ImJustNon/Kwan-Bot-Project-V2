import { Client, CommandInteraction, CommandInteractionOptionResolver, Interaction, InteractionResponse } from "discord.js";

interface CommandCallbackFunctionParams {
    client: any;
    interaction: CommandInteraction;
    config?: any;
    commandConfig: CommandConfig
}
type CommandCallbackFunction = (params: CommandCallbackFunctionParams) => Promise<void> | Promise<any>;


interface CommandConfig {
    name: string
    description: string
    type: number
    options: Array<object>
    userPermissions: Array<string> | null
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