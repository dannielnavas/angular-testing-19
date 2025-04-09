import type { Config } from 'jest';

export default {
  moduleNameMapper: {
    '@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '@products/(.*)$': '<rootDir>/src/app/products/$1',
    '@env/(.*)$': '<rootDir>/src/environments/$1',
  },
  collectCoverage: true,
  coverageReporters: ['html', 'text-summary'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!<rootDir>/node_modules/',
    '!<rootDir>/test/',
  ],
  coverageDirectory: './coverage',
} satisfies Config;
