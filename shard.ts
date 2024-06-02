import { Shard, ShardingManager } from "discord.js";
import path from "path";
import config from "./config/config";
import fs from "fs";
import { ChildProcess } from "child_process";
import { Worker } from "worker_threads";

const findIndexFile: string[] = fs.readdirSync(path.join(__dirname, ".")).filter((filename: string) => filename.includes("index"));

if (findIndexFile.length === 0) {
  	throw new Error('Index file not found.');
}

const manager: ShardingManager = new ShardingManager(path.join(__dirname, findIndexFile[0]), {
	token: config.client.token,
	totalShards: 'auto', 
	shardArgs: ['--ansi', '--color'], 
	respawn: true, 
	shardList: 'auto' 
});

manager.spawn().catch(error => {
  	console.error(`Error spawning shards:`, error);
});

manager.on('shardCreate', (shard: Shard) => {
	console.log(`> Launched shard ${shard.id}`);

	shard.on('ready', () => {
		console.log(`> Shard ${shard.id} is ready`);
	});

	shard.on('disconnect', () => {
		console.log(`> Shard ${shard.id} disconnected:`);
	});

	shard.on('reconnecting', () => {
		console.log(`> Shard ${shard.id} is reconnecting`);
	});

	shard.on('resume', () => {
		console.log(`> Shard ${shard.id} has resumed`);
	});

	shard.on('spawn', (process: ChildProcess | Worker) => {
		console.log(`> Shard ${shard.id} spawned`);
	});

	shard.on('death', (process: ChildProcess | Worker) => {
		if (process instanceof ChildProcess) {
			console.log(`> Shard ${shard.id}'s process died with code ${process.exitCode}, signal ${process.signalCode}`);
		} else {
			console.log(`> Shard ${shard.id}'s worker died`);
		}
	});

	shard.on('error', (error: Error) => {
		console.error(`> Shard ${shard.id} encountered an error:`, error);
	});

	shard.on('message', (message: any) => {
		console.log(`> Shard ${shard.id} received a message:`, message);
	});
});

process.on('SIGINT', () => {
	console.log('> Received SIGINT. Shutting down gracefully...');
	manager.shards.forEach(shard => {
		shard.kill();
	});
	process.exit(0);
});
