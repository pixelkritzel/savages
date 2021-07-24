import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from 'ui/Checkbox';
import { Iskill } from 'store/characters/skillModel';
import { Iweapon } from 'store/settings/settingWeaponModel';

interface RangeProps {
  attackSkill: Iskill;
  currentlyHoldWeapon: Iweapon;
}

export const Range = observer(function RangeFn({
  attackSkill,
  currentlyHoldWeapon,
  ...otherProps
}: RangeProps) {
  return (
    <fieldset>
      <legend>Range</legend>
      {[
        ['0', 'Short'],
        ['-2', 'Medium'],
        ['-4', 'Long'],
        ['-8', 'Extreme'],
      ].map(([rangeModifier, label], index) => (
        <Checkbox
          key={index}
          label={`${label} (${
            rangeModifier !== '-8'
              ? currentlyHoldWeapon.range[index]
              : currentlyHoldWeapon.range[2] * 4
          })`}
          disabled={
            rangeModifier === '-8' &&
            (currentlyHoldWeapon.weaponType.includes('shotgun') || !attackSkill.attackOptions.aim)
          }
          checked={attackSkill.attackOptions.range === rangeModifier}
          onChange={() =>
            attackSkill.attackOptions.set(
              'range',
              rangeModifier as Iskill['attackOptions']['range']
            )
          }
        />
      ))}
    </fieldset>
  );
});
