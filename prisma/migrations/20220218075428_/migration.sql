-- AlterTable
ALTER TABLE `user` MODIFY `gender` ENUM('Male', 'Famale', 'Unknown') NOT NULL DEFAULT 'Unknown';

-- CreateIndex
CREATE INDEX `banner_type_title_idx` ON `banner`(`type`, `title`);

-- CreateIndex
CREATE INDEX `user_username_realname_idx` ON `user`(`username`, `realname`);
