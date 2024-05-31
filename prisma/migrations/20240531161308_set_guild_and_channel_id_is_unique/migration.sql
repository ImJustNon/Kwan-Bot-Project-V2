/*
  Warnings:

  - A unique constraint covering the columns `[guild_id]` on the table `GuildMusicChannel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channel_id]` on the table `GuildMusicChannel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `GuildMusicChannel_guild_id_key` ON `GuildMusicChannel`(`guild_id`);

-- CreateIndex
CREATE UNIQUE INDEX `GuildMusicChannel_channel_id_key` ON `GuildMusicChannel`(`channel_id`);
