import localForage from 'localforage';

export async function loadCollection(collectionName: string) {
  const collection: any[] = [];

  await localForage.iterate((value, key) => {
    if (key.startsWith(collectionName)) {
      collection.push(value);
    }
  });

  return collection;
}
