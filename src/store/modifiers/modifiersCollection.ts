import { SOmodifier } from './modifierModel';
import { modifierModel, SImodifier, createModifierScaffold } from 'store/modifiers/modifierModel';
import { createCollection } from 'lib/state';

export const modifiersCollectionModel = createCollection<
  typeof modifierModel,
  // @ts-expect-error
  SImodifier,
  SOmodifier
>('modifiersCollection', modifierModel, createModifierScaffold);
