import express, { Router, Request, Response } from "express";
import { client } from "../../index";
import { Channel, Guild, GuildChannel, TextChannel } from "discord.js";
import { manager } from "../../music/manager";

const router: Router = express.Router();

router.get("/", async(req: Request, res: Response) =>{
    // const guild: Guild = await client.guilds.cache.get("882908098862415902");
    // const channel = guild.channels.cache.get("941181968803037214") as TextChannel | undefined;
    // channel?.send("Hello Word");
    // res.send("Hello Word");


    const player = await manager.joinVoiceChannel({
        guildId: "882908098862415902",
        channelId: "1098129828256960553",
        shardId: 0, 
    });

    const result = await player.node.rest.resolve("scsearch:snowhalation");
    console.log(result);
    if (!result?.data.length) return;
    await player.playTrack({ track: { encoded: result.data[0].encoded } });

});

export default router;