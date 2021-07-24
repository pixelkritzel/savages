import { observer } from 'mobx-react';
import React, { useState } from 'react';

import { Iskill } from 'store/characters/skillModel';

export const CalledShot: React.FC<{ attackSkill: Iskill }> = observer(({ attackSkill }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(0);

  function onChangeIsCustom() {
    if (typeof attackSkill.skillOptions.calledShot === 'number') {
      setIsCustom(false);
      attackSkill.skillOptions.set('calledShot', null);
    } else {
      setIsCustom(true);
      attackSkill.skillOptions.set('calledShot', customValue);
    }
  }

  function onChangeCustomValue(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    setCustomValue(value);
    attackSkill.skillOptions.set('calledShot', value);
  }

  function setCalledShot(value: string) {
    attackSkill.skillOptions.set(
      'calledShot',
      attackSkill.skillOptions.calledShot === value
        ? null
        : (value as typeof attackSkill['skillOptions']['calledShot'])
    );
  }

  return (
    <fieldset>
      <legend>Called Shot</legend>
      <label>
        <input
          type="checkbox"
          checked={attackSkill.skillOptions.calledShot === 'hand'}
          onChange={() => setCalledShot('hand')}
        />{' '}
        Hand
      </label>
      <label>
        <input
          type="checkbox"
          checked={attackSkill.skillOptions.calledShot === 'head'}
          onChange={() => setCalledShot('head')}
        />{' '}
        Head
      </label>
      <label>
        <input
          type="checkbox"
          checked={attackSkill.skillOptions.calledShot === 'helmet'}
          onChange={() => setCalledShot('helmet')}
        />{' '}
        Helmet
      </label>
      <label>
        <input
          type="checkbox"
          checked={attackSkill.skillOptions.calledShot === 'limbs'}
          onChange={() => setCalledShot('limbs')}
        />{' '}
        Limb
      </label>
      <label>
        <input
          type="checkbox"
          checked={typeof attackSkill.skillOptions.calledShot === 'number'}
          onChange={onChangeIsCustom}
        />{' '}
        Custom
      </label>
      <input
        type="number"
        disabled={!isCustom}
        value={customValue}
        max={0}
        onChange={onChangeCustomValue}
      />
    </fieldset>
  );
});
