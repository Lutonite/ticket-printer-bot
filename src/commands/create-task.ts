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
import { generateTaskImage } from '../lib/task-gen';
import { printImage } from '../lib/printer';

@ApplyOptions<Command.Options>({
	description: 'Create a task and print it',
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
				.addNumberOption((option) =>
					option
						.setName('priority')
						.setDescription('The priority level (1-3)')
						.setRequired(true)
						.addChoices({ name: 'High', value: 3 }, { name: 'Medium', value: 2 }, { name: 'Low', value: 1 })
				)
				// TODO: provide categories based on previous tasks
				.addStringOption((option) => option.setName('category').setDescription('The category of the task').setRequired(true))
				.addStringOption((option) => option.setName('title').setDescription('The title of the task').setRequired(true))
				.addNumberOption((option) => option.setName('deadline').setDescription('Amount of days until the deadline (defaults to 0)'))
				.addBooleanOption((option) => option.setName('subtasks').setDescription('Whether to add subtasks'))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const priority = interaction.options.getNumber('priority', true) as 1 | 2 | 3;
		const category = interaction.options.getString('category', true);
		const title = interaction.options.getString('title', true);
		const deadline = interaction.options.getNumber('deadline') ?? 0;
		const addSubtasks = interaction.options.getBoolean('subtasks') ?? false;

		const [followUpInteraction, subtasks] = addSubtasks ? await this.requestSubtasks(interaction) : [interaction, []];
		const reply = await followUpInteraction.deferReply({ flags: MessageFlags.Ephemeral });

		const taskImage = await generateTaskImage({
			priority,
			category,
			title,
			deadline,
			subtasks
		});

		await printImage(taskImage);
		await reply.edit({ embeds: [successEmbed('Task was printed successfully')] });
	}

	private async requestSubtasks(interaction: Command.ChatInputCommandInteraction): Promise<[ModalSubmitInteraction, string[]]> {
		const modal = new ModalBuilder()
			.setCustomId('subtaskModal')
			.setTitle('Subtasks')
			.addComponents(
				new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId('subtaskInput')
						.setLabel(`Enter the subtasks, one per line (max 10)`)
						.setStyle(TextInputStyle.Paragraph)
						.setRequired(true)
				)
			);

		await interaction.showModal(modal);

		const response = await interaction.awaitModalSubmit({
			filter: (i) => i.customId === 'subtaskModal' && i.user.id === interaction.user.id,
			time: 1000 * 60 * 5
		});

		const subtasks = response.fields
			.getTextInputValue('subtaskInput')
			.split('\n')
			.slice(0, 10)
			.map((s) => s.trim().replace(/^[+*-]/g, ''));

		return [response, subtasks];
	}
}
