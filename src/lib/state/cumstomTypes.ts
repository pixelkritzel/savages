import { types } from 'mobx-state-tree';
export const customTypes = {
  positiveNumber: types.refinement('positiveNumber', types.number, (number) => number > 0),
};
