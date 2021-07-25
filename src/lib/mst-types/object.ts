import { types } from 'mobx-state-tree';

type ObjectType = { [key: string]: any };

export const objectType = types.custom<ObjectType, ObjectType>({
  name: 'ObjectType',
  fromSnapshot(value: ObjectType) {
    return value;
  },
  toSnapshot(value: ObjectType) {
    return value;
  },
  isTargetType(value: unknown): boolean {
    return typeof value === 'object';
  },
  getValidationMessage(value: ObjectType): string {
    return '';
  },
});
