import { cast, types } from 'mobx-state-tree';
export const traitModifierModel = types
  .model('traitModifier', {
    value: 0,
    maximum: 0,
    minimum: 0,
    specialization: types.array(types.string),
    condition: types.maybe(types.string),
  })
  .views((self) => ({
    get modifications() {
      const modifications: {
        name: string;
        value: number | string;
      }[] = [];
      (['value', 'maximum', 'minimum'] as const).forEach((name) => {
        if (self[name] !== 0) {
          modifications.push({ name, value: self[name] });
        }
      });
      if (modifications.length > 0 && self.condition) {
        modifications.push({ name: 'condition', value: self.condition });
      }
      return modifications;
    },
  }))
  .actions((self) => ({
    set(key: any, value: any) {
      // @ts-ignore
      self[key] = cast(value);
    },
  }));
