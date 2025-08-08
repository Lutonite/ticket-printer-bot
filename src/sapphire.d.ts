import type { Snowflake } from 'discord.js';

declare module '@skyra/env-utilities' {
	interface Env {
		// The main guild ID
		GUILD_ID: Snowflake;

		// Printer
		PRINTER_INTERFACE: string;
	}
}
