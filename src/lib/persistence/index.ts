import localForage from 'localforage';

import { deleteItem } from './deleteItem';

import { loadCollection } from './loadCollection';
import { saveItem } from './saveItem';

localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'savages',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
});

export const persistence = {
  deleteItem,
  loadCollection,
  saveItem,
};
