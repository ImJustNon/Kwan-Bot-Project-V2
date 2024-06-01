import { Shard, WebSocketShard } from "discord.js";
import { ShardingManager } from "discord.js";
import path from "path";
import config from "./config/config";


const manager: ShardingManager = new ShardingManager("./index.ts", {
  token: config.client.token,
  totalShards: 'auto', 
});


manager.spawn();


manager.on('shardCreate', (shard: Shard) => {
  console.log(`Launched shard ${shard.id}`);
});