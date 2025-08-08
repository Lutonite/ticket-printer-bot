import satori, { SatoriOptions } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import * as dayjs from 'date-fns';
import { frCH } from 'date-fns/locale';

export interface Task {
	priority: 1 | 2 | 3;
	category: string;
	title: string;
	deadline: number;
	subtasks: string[];
}

export interface Message {
	title: string;
	content: string;
	author: string;
}

const lightningIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256">
		<path
			fill="currentColor"
			d="m213.85 125.46l-112 120a8 8 0 0 1-13.69-7l14.66-73.33l-57.63-21.64a8 8 0 0 1-3-13l112-120a8 8 0 0 1 13.69 7l-14.7 73.41l57.63 21.61a8 8 0 0 1 3 12.95Z"
		/>
	</svg>
);

const speechIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256">
		<path
			fill="currentColor"
			d="M128 24a104 104 0 0 0-91.82 152.88l-11.35 34.05a16 16 0 0 0 20.24 20.24l34.05-11.35A104 104 0 1 0 128 24M84 140a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44 0a12 12 0 1 1 12-12a12 12 0 0 1-12 12m44 0a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
		/>
	</svg>
);

const satoriOptions: SatoriOptions = {
	width: 570,
	fonts: [
		{
			name: 'Inter',
			data: fs.readFileSync(path.join(__dirname, '../../assets/inter.otf')),
			weight: 400,
			style: 'normal'
		},
		{
			name: 'Inter Bold',
			data: fs.readFileSync(path.join(__dirname, '../../assets/inter-bold.otf')),
			weight: 700,
			style: 'normal'
		}
	],
	embedFont: true
};

export async function generateMessageImage(message: Message): Promise<string> {
	const date = dayjs.formatDate(new Date(), 'EEEE, d MMMM, HH:mm', { locale: frCH });

	const messageSvg = await satori(
		<div
			style={{
				background: 'white',
				padding: '32px 5px',
				fontFamily: 'Inter',
				width: '100%',
				height: '100%',
				color: '#000',
				display: 'flex',
				flexDirection: 'column',
				fontSize: '24px'
			}}
		>
			<div
				style={{
					fontSize: '64px',
					fontWeight: 'bold',
					marginBottom: '8px',
					marginTop: '16px',
					display: 'flex',
					flexDirection: 'row',
					alignSelf: 'center'
				}}
			>
				{speechIcon()}
			</div>

			<div
				style={{
					display: 'flex',
					width: '100%',
					alignItems: 'center',
					flexDirection: 'column',
					textAlign: 'center',
					wordBreak: 'break-word'
				}}
			>
				<h2 style={{ fontFamily: 'Inter Bold', marginBottom: '8px' }}>{message.title}</h2>
			</div>

			<div
				style={{
					display: 'flex',
					padding: '0 18px',
					flexDirection: 'column',
					marginBottom: '5px',
					wordBreak: 'break-word'
				}}
			>
				<p>{message.content}</p>
			</div>

			<div
				style={{
					width: '100%',
					background: 'repeating-linear-gradient(to right, #000 0, #000 6px, transparent 6px, transparent 12px)',
					height: '2px',
					margin: '8px 0 24px 0'
				}}
			></div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					textAlign: 'center'
				}}
			>
				<div
					style={{
						fontSize: '24px',
						fontFamily: 'Inter Bold',
						fontWeight: 'bold',
						marginBottom: '12px'
					}}
				>
					{date}
				</div>

				<div
					style={{
						marginBottom: '12px'
					}}
				>
					{message.author}
				</div>
			</div>

			<div
				style={{
					width: '100%',
					background: 'repeating-linear-gradient(to right, #000 0, #000 6px, transparent 6px, transparent 12px)',
					height: '2px',
					margin: '12px 0 24px 0'
				}}
			></div>
		</div>,
		satoriOptions
	);

	return buildSvg(messageSvg);
}

export async function generateTaskImage(task: Task): Promise<string> {
	const deadline = dayjs.formatDate(dayjs.addDays(new Date(), task.deadline), 'EEEE, d MMMM', { locale: frCH });

	const taskSvg = await satori(
		<div
			style={{
				background: 'white',
				padding: '32px 5px',
				fontFamily: 'Inter',
				width: '100%',
				height: '100%',
				color: '#000',
				display: 'flex',
				flexDirection: 'column',
				fontSize: '24px'
			}}
		>
			<div
				style={{
					fontSize: '64px',
					fontWeight: 'bold',
					marginBottom: '8px',
					marginTop: '16px',
					display: 'flex',
					flexDirection: 'row',
					alignSelf: 'center'
				}}
			>
				{...Array.from({ length: task.priority }, () => lightningIcon())}
			</div>

			<div
				style={{
					display: 'flex',
					width: '100%',
					alignItems: 'center',
					flexDirection: 'column',
					textAlign: 'center'
				}}
			>
				<h3 style={{ fontSize: '1em', marginBottom: '8px' }}>{task.category.toUpperCase()}</h3>
			</div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					marginBottom: '5px',
					textAlign: 'center'
				}}
			>
				<h1 style={{ fontSize: '1.5em', fontFamily: 'Inter Bold' }}>{task.title}</h1>
			</div>

			<div
				style={{
					width: '100%',
					background: 'repeating-linear-gradient(to right, #000 0, #000 6px, transparent 6px, transparent 12px)',
					height: '2px',
					margin: '8px 0 24px 0'
				}}
			></div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					textAlign: 'center'
				}}
			>
				<div
					style={{
						fontSize: '24px',
						fontFamily: 'Inter Bold',
						fontWeight: 'bold',
						marginBottom: '12px'
					}}
				>
					{deadline}
				</div>

				<ul
					style={{
						alignSelf: 'flex-start',
						flexDirection: 'column',
						listStyleType: 'square',
						padding: '0 0 0 16px'
					}}
				>
					{task.subtasks.map((task, index) => (
						<li key={index} style={{ marginBottom: '8px' }}>
							<svg
								width="30"
								height="30"
								viewBox="0 0 32 32"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								style={{ marginRight: '2px' }}
							>
								<rect x="4" y="4" width="24" height="24" style={{ stroke: '#000', strokeWidth: '2', fill: 'none' }} />
							</svg>
							<span>{task}</span>
						</li>
					))}
				</ul>
			</div>

			<div
				style={{
					width: '100%',
					background: 'repeating-linear-gradient(to right, #000 0, #000 6px, transparent 6px, transparent 12px)',
					height: '2px',
					margin: '12px 0 24px 0'
				}}
			></div>
		</div>,
		satoriOptions
	);

	return buildSvg(taskSvg);
}

const buildSvg = (svg: string): string => {
	const pngData = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: 570
		}
	})
		.render()
		.asPng();

	const filePath = `/tmp/tickets/${randomUUID()}.png`;
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, pngData);
	return filePath;
};
