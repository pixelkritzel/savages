import localForage from 'localforage';

export async function saveItem(collectionName: string, item: { id: string; [key: string]: any }) {
  await localForage.setItem(`${collectionName}-${item.id}`, item);
}
