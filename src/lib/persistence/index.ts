import localForage from 'localforage';

import { loadCollection } from './loadCollection';
import { saveItem } from './saveItem';

localForage.config({
  driver: localForage.WEBSQL, // Force WebSQL; same as using setDriver()
  name: 'savages',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
});

export const persistence = {
  loadCollection,
  saveItem,
};
