import { types } from 'mobx-state-tree';
export const customTypes = {
  positiveNumber: types.optional(
    types.refinement('positiveNumber', types.number, (number) => number > -1),
    0
  ),
  negativeNumber: types.optional(
    types.refinement('negativeNumber', types.number, (number) => number < 1),
    0
  ),
};
