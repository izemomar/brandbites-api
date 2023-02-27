import type { Config } from '@jest/types';
import path from 'path';

/* const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: [path.join(process.cwd(), 'src')],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [path.join(process.cwd(), '__tests__', '**', '*.spec.ts')],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@utils/(.*)$': '<rootDir>/src/shared/utils/$1',
    '^@shared-middlewares/(.*)$':
      '<rootDir>/src/shared/infrastructure/http/middlewares/$1'
  },
  globals: {
    'ts-jest': {
      tsconfig: path.join(process.cwd(), 'tsconfig.json')
    },
    'tsconfig-paths': {
      baseUrl: path.join(process.cwd()),
      paths: {
        '@': ['src'],
        '@database/*': ['src/database/*'],
        '@config/*': ['src/config/*'],
        '@shared/*': ['src/shared/*'],
        '@utils/*': ['src/shared/utils/*'],
        '@shared-middlewares/*': [
          'src/shared/infrastructure/http/middlewares/*'
        ]
      }
    }
  }
};

export default config; */

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    displayName: {
      name: 'placeNameOfYourAppHere',
      color: 'greenBright'
    },
    verbose: true,
    setupFiles: ['dotenv/config'],
    testMatch: ['**/**/*.spec.ts'],
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
