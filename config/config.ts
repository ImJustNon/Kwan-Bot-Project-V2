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
            name: "Localhost",
            url: "localhost:6558",
            auth: "reirin",
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