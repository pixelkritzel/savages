import { observer } from 'mobx-react';
import React, { useState } from 'react';

import { Iskill } from 'store/characters/skillModel';

export const CalledShot: React.FC<{ shooting: Iskill }> = observer(({ shooting }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(0);

  function onChangeIsCustom() {
    if (typeof shooting.attack.calledShot === 'number') {
      setIsCustom(false);
      shooting.attack.set('calledShot', null);
    } else {
      setIsCustom(true);
      shooting.attack.set('calledShot', customValue);
    }
  }

  function onChangeCustomValue(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    setCustomValue(value);
    shooting.attack.set('calledShot', value);
  }

  function setCalledShot(value: string) {
    shooting.attack.set(
      'calledShot',
      shooting.attack.calledShot === value
        ? null
        : (value as typeof shooting['attack']['calledShot'])
    );
  }

  return (
    <fieldset>
      <legend>Called Shot</legend>
      <label>
        <input
          type="checkbox"
          checked={shooting.attack.calledShot === 'hand'}
          onChange={() => setCalledShot('hand')}
        />{' '}
        Hand
      </label>
      <label>
        <input
          type="checkbox"
          checked={shooting.attack.calledShot === 'head'}
          onChange={() => setCalledShot('head')}
        />{' '}
        Head
      </label>
      <label>
        <input
          type="checkbox"
          checked={shooting.attack.calledShot === 'limbs'}
          onChange={() => setCalledShot('limbs')}
        />{' '}
        Limb
      </label>
      <label>
        <input
          type="checkbox"
          checked={typeof shooting.attack.calledShot === 'number'}
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
