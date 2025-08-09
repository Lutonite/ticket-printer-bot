import { join } from 'node:path';

export const rootDir = join(import.meta.dirname, '..', '..');
export const srcDir = join(rootDir, 'src');
