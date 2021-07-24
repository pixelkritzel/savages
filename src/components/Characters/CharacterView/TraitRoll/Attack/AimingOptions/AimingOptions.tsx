import React from 'react';
import { observer } from 'mobx-react';
import { TraitRollOptionsGrid } from '../../TraitRollOptionsGrid';
import { Iskill } from 'store/characters/skillModel';
import { Checkbox } from 'ui/Checkbox';

interface AimingOptionsProps {
  attackSkill: Iskill;
}

export const AimingOptions = observer(function AimingOptionsFn({
  attackSkill,
  ...otherProps
}: AimingOptionsProps) {
  function setIgnore() {
    attackSkill.skillOptions?.set(
      'aim',
      attackSkill.skillOptions.aim !== 'ignore' ? 'ignore' : null
    );
  }

  function setPlusTwo() {
    attackSkill.skillOptions?.set(
      'aim',
      attackSkill.skillOptions.aim !== 'plusTwo' ? 'plusTwo' : null
    );
  }

  return (
    <fieldset>
      <legend>Aim</legend>
      <TraitRollOptionsGrid>
        <Checkbox
          label="Ignore up to -4 penalties"
          checked={attackSkill.skillOptions.aim === 'ignore'}
          onChange={setIgnore}
        />
        <Checkbox
          label="Add +2 bonus"
          checked={attackSkill.skillOptions.aim === 'plusTwo'}
          onChange={setPlusTwo}
        />
      </TraitRollOptionsGrid>
    </fieldset>
  );
});
