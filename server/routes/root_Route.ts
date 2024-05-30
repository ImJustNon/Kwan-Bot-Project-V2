import express, { Router, Request, Response } from "express";
import { client } from "../../index";
import { Channel, Guild, GuildChannel, TextChannel } from "discord.js";

const router: Router = express.Router();

router.get("/", async(req: Request, res: Response) =>{
});

export default router;