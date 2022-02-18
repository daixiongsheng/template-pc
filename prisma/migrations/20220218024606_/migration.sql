-- AlterTable
ALTER TABLE `user` MODIFY `status` ENUM('Enabled', 'Disabled', 'Deleted') NOT NULL DEFAULT 'Enabled';
