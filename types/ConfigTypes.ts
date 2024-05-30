import { NodeOption } from "shoukaku";

type ServerConfig = {
    port: number;
}
type ClientConfig = {
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

interface Config {
    server: ServerConfig;
    client: ClientConfig;
    nodes: NodeOption[];
    users: UsersConfig;
    api: APIConfig;
}

export {
    Config
}