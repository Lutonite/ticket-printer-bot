import { envParseString } from '@skyra/env-utilities';
import { CharacterSet, PrinterTypes, ThermalPrinter } from 'node-thermal-printer';
import fs from 'node:fs/promises';

const printer = new ThermalPrinter({
	type: PrinterTypes.EPSON,
	interface: envParseString('PRINTER_INTERFACE'),
	characterSet: CharacterSet.ISO8859_15_LATIN9,
	width: 48,
	options: {
		timeout: 5000
	}
});

export async function printImage(imagePath: string): Promise<void> {
	try {
		printer.alignCenter();
		await printer.printImage(imagePath);
		printer.partialCut();
		await printer.execute();
	} catch (error) {
		console.error('Error printing image:', error);
	} finally {
		printer.clear();
		await fs.rm(imagePath);
	}
}
