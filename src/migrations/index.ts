import * as migration_20250828_040328 from './20250828_040328';
import * as migration_20250830_012336 from './20250830_012336';
import * as migration_20250907_204606 from './20250907_204606';
import * as migration_20250907_220448 from './20250907_220448';
import * as migration_20250907_222112 from './20250907_222112';

export const migrations = [
  {
    up: migration_20250828_040328.up,
    down: migration_20250828_040328.down,
    name: '20250828_040328',
  },
  {
    up: migration_20250830_012336.up,
    down: migration_20250830_012336.down,
    name: '20250830_012336',
  },
  {
    up: migration_20250907_204606.up,
    down: migration_20250907_204606.down,
    name: '20250907_204606',
  },
  {
    up: migration_20250907_220448.up,
    down: migration_20250907_220448.down,
    name: '20250907_220448',
  },
  {
    up: migration_20250907_222112.up,
    down: migration_20250907_222112.down,
    name: '20250907_222112'
  },
];
