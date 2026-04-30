// jest.config.ts
export default {
  preset: 'ts-jest/presets/default-esm', // для ESM проектов
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@repositories/(.*)$': '<rootDir>/database/repositories/$1',
    '^@models/(.*)$': '<rootDir>/database/models/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@di/(.*)$': '<rootDir>/database/di/$1'
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
};