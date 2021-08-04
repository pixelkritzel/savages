import { SnapshotIn } from 'mobx-state-tree';
import { createCollection } from 'lib/state';

import { createWeaponScaffold, weaponModel, SIweapon, SOweapon } from './weaponModel';

export const weaponsCollection = createCollection<
  typeof weaponModel,
  // @ts-expect-error
  SIweapon,
  SOweapon
>('weaponsCollection', weaponModel, createWeaponScaffold);

export interface SIweaponsCollection extends SnapshotIn<typeof weaponsCollection> {}
