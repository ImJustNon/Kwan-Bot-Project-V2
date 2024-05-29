import { Client, Collection } from "discord.js";
import { CommandConfig } from "./CommandTypes";

interface ClientParams extends Client {
    commands: CommandConfig[]
    modules: string[]
}

export {
    ClientParams
}