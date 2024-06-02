import { Shard, WebSocketShard } from "discord.js";
import { ShardingManager } from "discord.js";
import path from "path";
import config from "./config/config";
import fs from "fs";

const findIndexFile: string[] = fs.readdirSync(path.join(__dirname, ".")).filter((filename: string) => filename.includes("index"));

const manager: ShardingManager = new ShardingManager(path.join(__dirname, findIndexFile[0]), {
  token: config.client.token,
  totalShards: 'auto', 
});


manager.spawn();


manager.on('shardCreate', (shard: Shard) => {
  console.log(`Launched shard ${shard.id}`);
});