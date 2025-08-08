import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import {
	ActionRowBuilder,
	ApplicationIntegrationType,
	MessageFlags,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import { successEmbed } from '../lib/utils';
import { generateMessageImage } from '../lib/task-gen';
import { printImage } from '../lib/printer';

@ApplyOptions<Command.Options>({
	description: 'Send a little message to Lutonite'
})
export default class CreateTaskCommand extends Command {
	// Command registration
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.setIntegrationTypes([ApplicationIntegrationType.UserInstall])
				.addStringOption((option) => option.setName('title').setDescription('The title of the message').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const title = interaction.options.getString('title', true);
		const author = `@${interaction.user.tag}`;

		const [followUpInteraction, content] = await this.requestContent(interaction);
		const reply = await followUpInteraction.deferReply({ flags: MessageFlags.Ephemeral });

		const taskImage = await generateMessageImage({ title, author, content });

		await printImage(taskImage);
		await reply.edit({ embeds: [successEmbed('Task was printed successfully')] });
	}

	private async requestContent(interaction: Command.ChatInputCommandInteraction): Promise<[ModalSubmitInteraction, string]> {
		const modal = new ModalBuilder()
			.setCustomId('contentModal')
			.setTitle('Message Content')
			.addComponents(
				new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId('contentInput')
						.setLabel(`Enter the content of your message`)
						.setStyle(TextInputStyle.Paragraph)
						.setRequired(true)
						.setMaxLength(1337)
				)
			);

		await interaction.showModal(modal);

		const response = await interaction.awaitModalSubmit({
			filter: (i) => i.customId === 'contentModal' && i.user.id === interaction.user.id,
			time: 1000 * 60 * 5
		});

		const content = response.fields.getTextInputValue('contentInput').trim();

		return [response, content];
	}
}
