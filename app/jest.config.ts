import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    displayName: {
      name: 'brandbite-api',
      color: 'greenBright'
    },
    verbose: true,
    setupFiles: ['dotenv/config'],
    testMatch: ['<rootDir>/__tests__/**/**/*.spec.ts'],
    testEnvironment: 'node',
    detectOpenHandles: true,
    collectCoverage: true,
    transform: { '^.+\\.tsx?$': 'ts-jest' },
    globalTeardown: '<rootDir>/jest-globals-teardown.ts',
    forceExit: true,
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@database/(.*)$': '<rootDir>/src/database/$1',
      '^@config/(.*)$': '<rootDir>/src/config/$1',
      '^@shared/(.*)$': '<rootDir>/src/shared/$1',
      '^@utils/(.*)$': '<rootDir>/src/shared/utils/$1',
      '^@shared-middlewares/(.*)$':
        '<rootDir>/src/shared/infrastructure/http/middlewares/$1'
    }
  };
};
