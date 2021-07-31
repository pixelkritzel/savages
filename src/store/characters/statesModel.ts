import { Instance, types } from 'mobx-state-tree';

export const statesModel = types
  .model('statesModel', {
    isDistracted: false,
    isVulnerable: false,
    isEntangled: false,
    isBound: false,
    isShaken: false,
    isStunned: false,
  })
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      switch (key) {
        case 'isEntangled':
          if (value) {
            self.isEntangled = true;
            self.isDistracted = true;
          } else {
            self.isEntangled = false;
            self.isDistracted = false;
          }
          break;
        case 'isBound':
          if (value) {
            self.isBound = true;
            self.isDistracted = true;
            self.isVulnerable = true;
          } else {
            self.isBound = false;
            self.isDistracted = false;
            self.isVulnerable = false;
          }
          break;
        default:
          self[key] = value;
      }
    },
  }));
