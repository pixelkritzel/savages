import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from 'ui/Checkbox';
import { Iskill } from 'store/characters/skillModel';
import { Iweapon } from 'store/settings/settingWeaponModel';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  row-gap: ${({ theme }) => theme.rhythms.vertical};
  column-gap: ${({ theme }) => theme.rhythms.hoizontal};
`;

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
      <GridContainer>
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
              (currentlyHoldWeapon.weaponType.includes('shotgun') || !attackSkill.skillOptions.aim)
            }
            checked={attackSkill.skillOptions.range === rangeModifier}
            onChange={() =>
              attackSkill.skillOptions.set(
                'range',
                rangeModifier as Iskill['skillOptions']['range']
              )
            }
          />
        ))}
      </GridContainer>
    </fieldset>
  );
});
