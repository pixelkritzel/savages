import { trait } from './trait';
import { getPropertyMembers, types } from 'mobx-state-tree';
import { attributesModel } from './attributesModel';

const { properties: attributes } = getPropertyMembers(attributesModel);

export const skillModel = types.compose(
  'skillModel',
  trait,
  types.model({
    associatedAttribute: types.enumeration(Object.keys(attributes)),
    specializations: types.maybe(types.array(types.string)),
  })
);
