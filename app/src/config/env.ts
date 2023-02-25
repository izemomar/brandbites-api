import * as dotenv from 'dotenv';
import { TEnv } from '@utils/types/env';
import path from 'path';

/**
 * Retrieves the value of a specific key from the environment variables.
 *
 * @param key - The key of the environment variable to retrieve.
 *
 * @returns The value of the specified environment variable.
 */
export function env<K extends keyof TEnv>(key: K): TEnv[K] {
  const envFileName =
    process.env.NODE_ENV === 'production' ? '.env-prod' : `.env-dev`;

  const envPath = path.join(process.cwd(), envFileName);

  dotenv.config({ path: envPath });

  return process.env[key] as TEnv[K];
}

/**
 * Retrieves the value of a specific key from the environment variables or returns a default value if the key is not found.
 *
 * @param key - The key of the environment variable to retrieve.
 * @param defaultValue - The default value to return if the key is not found.
 *
 * @returns {TEnv[K]} - The value of the specified environment variable, or the default value if the key is not found.
 */
export function envOr<K extends keyof TEnv>(
  key: K,
  defaultValue: TEnv[K]
): TEnv[K] {
  const value = env(key);
  return value ? value : defaultValue;
}

/**
 * Retrieves a default value for a specific key if the key is not found in the environment variables.
 *
 * @param key - The key of the environment variable to retrieve.
 *
 * @returns {TEnv[K]} - A default value for the specified environment variable if the key is not found.
 */
export function defaultEnv<K extends keyof TEnv>(key: K): TEnv[K] {
  const defaults = {
    DB_USERNAME: 'root',
    DB_DATABASE: 'test',
    DB_PASSWORD: 'root',
    DB_HOST: 'localhost',
    DB_PORT: 3306,
    SERVER_PORT: 3000,
    ALLOWED_ORIGINS: '*'
  };

  return defaults![key];
}

/**
 * Determines if a specific environment variable is set to a truthy value.
 *
 * @param key - The key of the environment variable to check.
 *
 * @returns {boolean} - True if the environment variable is set to a truthy value, false otherwise.
 */
export function envIsTrue<K extends keyof TEnv>(key: K): boolean {
  return (
    env(key) == 'true' ||
    env(key) == '1' ||
    env(key) === 'yes' ||
    env(key) === 'on'
  );
}
