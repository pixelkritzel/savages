import { types, Instance, IAnyType, ISimpleType } from 'mobx-state-tree';

export function createSet<T extends IAnyType | string>(
  name: string,
  type: T extends IAnyType ? IAnyType : ISimpleType<T>
) {
  return types
    .model(name, {
      array: types.array(type),
    })
    .views((self) => ({
      get length() {
        return self.array.length;
      },
    }))
    .actions((self) => ({
      delete(value: Instance<typeof type>) {
        self.array.splice(self.array.indexOf(value));
      },
      add(value: Instance<typeof type>) {
        if (!self.array.includes(value)) {
          self.array.push(value);
        }
      },
      clear() {
        self.array.splice(0, self.array.length);
      },
    }));
}

export interface IstringSet extends Instance<ReturnType<typeof createSet>> {}
