import { SIskillSetting } from 'store/settings/settingSkillModel';

export const shooting: SIskillSetting = {
  _id: 'shooting',
  name: 'Shooting',
  description:
    'Shooting covers all attempts to hit a target with a ranged weapon such as a bow, pistol, or rocket launcher (thrown weapons use Athletics, page 29). See Chapter Three for details on ranged combat',
  associatedAttribute: 'agility',
  availableSkillSpezializations: [
    { _id: 'shortarms', name: 'Shortarms' },
    { _id: 'longarms', name: 'Longarms' },
  ],
};
