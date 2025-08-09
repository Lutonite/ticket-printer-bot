import { Precondition } from '@sapphire/framework';
import { envParseArray } from '@skyra/env-utilities';
import { CommandInteraction, ContextMenuCommandInteraction, Message, type Snowflake } from 'discord.js';

let printerEnabled: boolean = true;

export class KillSwitchPrecondition extends Precondition {
	public override async messageRun(message: Message) {
		// for Message Commands
		return this.checkPrinterStatus(message.author.id);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		// for Slash Commands
		return this.checkPrinterStatus(interaction.user.id);
	}

	public override async contextMenuRun(interaction: ContextMenuCommandInteraction) {
		// for Context Menu Command
		return this.checkPrinterStatus(interaction.user.id);
	}

	private checkPrinterStatus(userId: Snowflake) {
		if (KillSwitchPrecondition.printingEnabled) {
			return this.ok();
		}

		if (envParseArray('PRINTER_OWNERS', []).includes(userId)) {
			return this.ok();
		}

		return this.error({ message: 'The printer is currently disabled, please try again later.' });
	}

	public static get printingEnabled(): boolean {
		return printerEnabled;
	}

	public static enablePrinting(): void {
		printerEnabled = true;
	}

	public static disablePrinting(): void {
		printerEnabled = false;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		KillSwitch: never;
	}
}
