import { types, Instance, IAnyType, ISimpleType } from 'mobx-state-tree';

export function createBoxedArray<T extends IAnyType | string>(
  name: string,
  type: T extends IAnyType ? IAnyType : ISimpleType<T>
) {
  return types.optional(
    types
      .model(name, {
        array: types.optional(types.array(type), []),
      })
      .views((self) => ({
        has(value: Instance<typeof type>) {
          return self.array.includes(value);
        },
        get length() {
          return self.array.length;
        },
      }))
      .actions((self) => ({
        delete(value: Instance<typeof type>) {
          self.array.splice(self.array.indexOf(value));
        },
        add(value: Instance<typeof type>) {
          self.array.push(value);
        },
        set(index: number, value: Instance<typeof type>) {
          self.array[index] = value;
        },
        clear() {
          self.array.splice(0, self.array.length);
        },
      })),
    {}
  );
}

export interface IboxedArray extends Instance<ReturnType<typeof createBoxedArray>> {}
