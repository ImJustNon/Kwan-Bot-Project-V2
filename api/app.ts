import express, { Express } from "express";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import config from "../config/config";

const app: Express = express();

app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
}));
app.use(express.json({
    limit: "50mb",
}));

const findRouteFiles: Array<string> = fs.readdirSync(path.join(__dirname, "./routes"));
const filteredRouteFiles: Array<string> = findRouteFiles.filter((filename: string) => filename.endsWith("_Route.ts") && !filename.startsWith("old_"));
filteredRouteFiles.forEach((filename: string) =>{
    try {
        const routePath = path.join(__dirname, "./routes", filename);
        import(routePath).then(fileData => {
            app.use("/api", fileData.default);
            console.log(('[Route] ') + (`Loaded : ${filename} : ✅`));
        });
        
    }
    catch(e){
        console.log(('[Routes] ') + (`Fail to Load : ${filename} : ❌ : `) + (e));
    }
});


function StartServer(): void {
    app.listen(config.server.port, (): void =>{
        console.log(`> Listening on port : ${config.server.port}`);
    });
}

StartServer();