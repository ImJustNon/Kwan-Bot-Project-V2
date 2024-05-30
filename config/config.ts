import dotenv from "dotenv";
import { Config } from "../types/ConfigTypes";
dotenv.config();


const config: Config = {
    server: {
        port: parseInt(process.env.SERVER_PORT || "")
    },
    client: {
        token: process.env.CLIENT_TOKEN || "",
        id: process.env.CLIENT_ID || "",
        secret: process.env.CLIENT_SECRET || "",
    },
    nodes: [
        {
            name: "local-node",
            host: "localhost",
            port: 6558,
            password: "reirin",
        },
    ],
    users: {
        admins: [""],
        owners: [""],
        developers: [""]
    },
    api: {

    }
}



export default config;