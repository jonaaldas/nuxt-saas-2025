ALTER TABLE `users` RENAME TO `accounts`;--> statement-breakpoint
DROP INDEX `users_email_unique`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text,
	`auth_type` text NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "email", "password", "auth_type", "name", "avatar_url", "created_at", "updated_at", "deleted_at") SELECT "id", "email", "password", "auth_type", "name", "avatar_url", "created_at", "updated_at", "deleted_at" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_email_unique` ON `accounts` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `accounts` (`email`);--> statement-breakpoint
CREATE TABLE `__new_password_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_password_reset_tokens`("id", "account_id", "token", "expires_at", "created_at", "updated_at", "deleted_at") SELECT "id", "account_id", "token", "expires_at", "created_at", "updated_at", "deleted_at" FROM `password_reset_tokens`;--> statement-breakpoint
DROP TABLE `password_reset_tokens`;--> statement-breakpoint
ALTER TABLE `__new_password_reset_tokens` RENAME TO `password_reset_tokens`;--> statement-breakpoint
CREATE UNIQUE INDEX `password_reset_tokens_token_unique` ON `password_reset_tokens` (`token`);--> statement-breakpoint
CREATE INDEX `idx_password_reset_tokens_token` ON `password_reset_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `__new_stripe_customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`stripe_customer_id` text NOT NULL,
	`plan_type` text NOT NULL,
	`plan_name` text,
	`credits` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_stripe_customers`("id", "account_id", "stripe_customer_id", "plan_type", "plan_name", "credits", "created_at", "updated_at", "deleted_at") SELECT "id", "account_id", "stripe_customer_id", "plan_type", "plan_name", "credits", "created_at", "updated_at", "deleted_at" FROM `stripe_customers`;--> statement-breakpoint
DROP TABLE `stripe_customers`;--> statement-breakpoint
ALTER TABLE `__new_stripe_customers` RENAME TO `stripe_customers`;--> statement-breakpoint
CREATE UNIQUE INDEX `stripe_customers_stripe_customer_id_unique` ON `stripe_customers` (`stripe_customer_id`);--> statement-breakpoint
CREATE INDEX `idx_stripe_customers_account_id` ON `stripe_customers` (`account_id`);