import { Client, Collection } from "discord.js";
import { CommandConfig, CommandsCollection } from "./CommandTypes";

interface ClientParams extends Client {
    commands: CommandsCollection;
    modules: string[];
}

export {
    ClientParams
}