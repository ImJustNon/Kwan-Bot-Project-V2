import express, { RequestHandler, Router } from "express";
import { Request, Response } from "express";
import { ClientParams } from "../../types/ClientTypes";
import bodyParser from "body-parser";
import { SystemInfoController } from "../controllers/systemInfo.controller"; 

const urlEncoded: RequestHandler = bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
});

const router: Router = express.Router();


function AppRouter(client: ClientParams): Router {

    router.get('/api/v1/systeminfo', urlEncoded, async(req: Request, res: Response): Promise<Response | void> => await SystemInfoController(req, res, client));


    return router;
}


export default AppRouter;