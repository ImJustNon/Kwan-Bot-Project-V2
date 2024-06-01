import { ColorResolvable } from "discord.js";
import { NodeGroup } from "poru";

type ServerConfig = {
    port: number;
}
type ClientConfig = {
    sharding: boolean;
    token: string;
    id: string;
    secret: string;
}
type UsersConfig = {
    admins: Array<string>;
    owners: Array<string>;
    developers: Array<string>;
}
type APIConfig = {
    
}
type AssetsConfig = {
    musicChannel: {
        bannerUrl: string;
        defaultUrl: string;
        defaultColor: ColorResolvable;
    }
}

interface Config {
    server: ServerConfig;
    client: ClientConfig;
    nodes: NodeGroup[];
    users: UsersConfig;
    api: APIConfig;
    assets: AssetsConfig;
}

export {
    Config
}