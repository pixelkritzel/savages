import { types } from 'mobx-state-tree';

import { skillOptions } from './skillOptions';
import { traitOptions } from './traitOptions';

export const traitRollOptions = types.compose('traitRollOptions', traitOptions, skillOptions);
