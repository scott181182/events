import * as migration_20250828_040328 from './20250828_040328';

export const migrations = [
  {
    up: migration_20250828_040328.up,
    down: migration_20250828_040328.down,
    name: '20250828_040328'
  },
];
