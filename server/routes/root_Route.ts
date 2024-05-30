import express, { Router, Request, Response } from "express";
import { client } from "../../index";
import { Channel, Guild, GuildChannel, TextChannel } from "discord.js";
import { shoukaku } from "../../music/shoukaku";

const router: Router = express.Router();

router.get("/", async(req: Request, res: Response) =>{

    // get a node with least load to resolve a track
    const node = await shoukaku.options.nodeResolver(shoukaku.nodes);
    const result = await node.rest.resolve("ytsearch:จีบเธอไม่ได้");
    if (!result.data.length) return;
    // we now have a track metadata, we can use this to play tracks
    const metadata = result.data.shift();
    // you now join a voice channel by querying the main shoukaku class, not on the node anymore
    const player = await shoukaku.joinVoiceChannel({
        guildId: "882908098862415902",
        channelId: "1098129828256960553",
        shardId: 0, // if unsharded it will always be zero (depending on your library implementation)
    });
    await player.playTrack({ track: metadata.encoded });
});

export default router;