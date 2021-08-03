import { types, Instance, IAnyModelType, ISimpleType } from 'mobx-state-tree';

export function createSet<T extends IAnyModelType | string>(
  name: string,
  type: T extends IAnyModelType ? IAnyModelType : ISimpleType<T>
) {
  return types
    .model(name, {
      array: types.array(type),
    })
    .views((self) => ({
      has(value: Instance<typeof type>) {
        return self.array.includes(value);
      },
    }))
    .actions((self) => ({
      delete(value: Instance<typeof type>) {
        self.array.splice(self.array.indexOf(value));
      },
      add(value: Instance<typeof type>) {
        if (!self.has(value)) {
          self.array.push(value);
        }
      },
      clear() {
        self.array.splice(0, self.array.length);
      },
    }));
}

export interface IstringSet extends Instance<ReturnType<typeof createSet>> {}
