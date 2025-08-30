import * as migration_20250828_040328 from './20250828_040328';
import * as migration_20250830_012336 from './20250830_012336';

export const migrations = [
  {
    up: migration_20250828_040328.up,
    down: migration_20250828_040328.down,
    name: '20250828_040328',
  },
  {
    up: migration_20250830_012336.up,
    down: migration_20250830_012336.down,
    name: '20250830_012336'
  },
];
