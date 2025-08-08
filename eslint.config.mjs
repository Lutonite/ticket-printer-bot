// @ts-check
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import sapphireConfig from '@sapphire/eslint-config';

const compat = new FlatCompat();

export default tseslint.config(
    ...compat.config(sapphireConfig)
);
