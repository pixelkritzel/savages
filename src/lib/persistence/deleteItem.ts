import localForage from 'localforage';

export async function deleteItem(collection: string, id: string) {
  await localForage.removeItem(`${collection}-${id}`);
}
