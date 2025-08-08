import {
	container,
	type ChatInputCommandSuccessPayload,
	type Command,
	type ContextMenuCommandSuccessPayload,
	type MessageCommandSuccessPayload
} from '@sapphire/framework';
import { cyan } from 'colorette';
import { EmbedBuilder, type APIUser, type Guild, type User } from 'discord.js';

export function logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
	const successLoggerData =
		'interaction' in payload
			? getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command)
			: getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);

	container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
}

export function getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
	const shard = getShardInfo(guild?.shardId ?? 0);
	const commandName = getCommandInfo(command);
	const author = getAuthorInfo(user);
	const sentAt = getGuildInfo(guild);

	return { shard, commandName, author, sentAt };
}

function getShardInfo(id: number) {
	return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
	return cyan(command.name);
}

export function getAuthorInfo(author: User | APIUser) {
	return `${author.username}[${cyan(author.id)}]`;
}

export function getGuildInfo(guild: Guild | null) {
	if (guild === null) return 'Direct Messages';
	return `${guild.name}[${cyan(guild.id)}]`;
}

export function errorEmbed(message: string): EmbedBuilder {
	return new EmbedBuilder().setColor('#DC2626').addFields({
		name: '❌  Error',
		value: message
	});
}

export function successEmbed(message: string): EmbedBuilder {
	return new EmbedBuilder().setColor('#6CC070').addFields({
		name: '✅  Success',
		value: message
	});
}
