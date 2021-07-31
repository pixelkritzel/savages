import { IDisposer, Instance, types, addMiddleware, SnapshotOut } from 'mobx-state-tree';
import { sizeType } from 'store/consts';

const rateOfFire = types.optional(
  types.union(
    types.literal(1),
    types.literal(2),
    types.literal(3),
    types.literal(4),
    types.literal(5),
    types.literal(6)
  ),
  1
);

export const skillOptions = types
  .model('attackModel', {
    aim: types.optional(types.union(types.null, types.enumeration(['ignore', 'plusTwo'])), null),
    calledShot: types.optional(
      types.union(types.enumeration(['hand', 'head', 'helmet', 'limbs']), types.null, types.number),
      null
    ),
    cover: types.optional(
      types.union(types.null, types.enumeration(['-2', '-4', '-6', '-8'])),
      null
    ),
    isAthleticsAttack: false,
    isNonLethal: false,
    isOneHandedAttack: false,
    isProneTarget: false,
    isRecoil: false,
    isShotgunSlugs: false,
    isTheDrop: false,
    isThreeRoundBurst: false,
    isUnarmedDefender: false,
    isUnstablePlatform: false,
    isSupressiveFire: false,
    range: types.optional(types.enumeration(['0', '-2', '-4', '-8']), '0'),
    rateOfFire: rateOfFire,
    scale: sizeType,
    speed: types.optional(types.enumeration(['0', '-1', '-2', '-4', '-6', '-8', '-10']), '0'),
    gangUp: 0,
  })
  .actions((self) => {
    const disposers: IDisposer[] = [];

    function afterCreate() {
      disposers.push(
        addMiddleware(self, (call, next) => {
          if (call.name === 'set' && call.args[0] === 'rateOfFire') {
            set('isRecoil', call.args[1] > 1);
          }
          return next(call);
        })
      );
    }

    function beforeDestroy() {
      disposers.forEach((disposer) => disposer());
    }

    function set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    }

    return { afterCreate, beforeDestroy, set };
  });

export interface IskillOptions extends Instance<typeof skillOptions> {}
export interface SOskillOptions extends SnapshotOut<typeof skillOptions> {}
