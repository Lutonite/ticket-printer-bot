import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { ApplicationIntegrationType, MessageFlags } from 'discord.js';
import { successEmbed } from '#lib/utils';
import { KillSwitchPrecondition } from '#preconditions/KillSwitch';

@ApplyOptions<Command.Options>({
	description: '[Owner Only] Toggle printing tickets',
	preconditions: ['OwnerOnly']
})
export default class CreateTaskCommand extends Command {
	// Command registration
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.setIntegrationTypes([ApplicationIntegrationType.UserInstall])
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable or disable printing tickets').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const enable = interaction.options.getBoolean('enable', true);
		if (enable) {
			KillSwitchPrecondition.enablePrinting();
		} else {
			KillSwitchPrecondition.disablePrinting();
		}

		await interaction.reply({ embeds: [successEmbed(`Printing has been ${enable ? 'enabled' : 'disabled'}.`)], flags: MessageFlags.Ephemeral });
	}
}
