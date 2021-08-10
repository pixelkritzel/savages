import { Instance } from 'mobx-state-tree';

import {
  modifierModel,
  SImodifier,
  createModifierScaffold,
  Imodifier,
} from 'store/modifiers/modifierModel';
import { createCollection } from 'lib/state';

export const modifiersCollectionModel = createCollection<
  typeof modifierModel,
  Imodifier,
  SImodifier
>('modifiersCollection', modifierModel, createModifierScaffold);

export interface Imodifiers extends Instance<typeof modifiersCollectionModel> {}
