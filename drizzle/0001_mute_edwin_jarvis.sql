CREATE TABLE `clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` varchar(64) NOT NULL,
	`userAgent` text,
	`referrer` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clicks_id` PRIMARY KEY(`id`)
);
