import { Instance, types } from 'mobx-state-tree';

export const traitOptions = types
  .model('traitOptions', {
    isVulnerableTarget: false,
    isJoker: false,
    numberOfActions: 0,
    customDiceDifference: 0,
    customBonus: 0,
  })
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));
