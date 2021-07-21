import { observer } from 'mobx-react';
import React, { useState } from 'react';

import { Iskill } from 'store/characters/skillModel';

export const CalledShot: React.FC<{ shooting: Iskill }> = observer(({ shooting }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(0);

  function onChangeIsCustom() {
    if (typeof shooting.attackOptions.calledShot === 'number') {
      setIsCustom(false);
      shooting.attackOptions.set('calledShot', null);
    } else {
      setIsCustom(true);
      shooting.attackOptions.set('calledShot', customValue);
    }
  }

  function onChangeCustomValue(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    setCustomValue(value);
    shooting.attackOptions.set('calledShot', value);
  }

  function setCalledShot(value: string) {
    shooting.attackOptions.set(
      'calledShot',
      shooting.attackOptions.calledShot === value
        ? null
        : (value as typeof shooting['attackOptions']['calledShot'])
    );
  }

  return (
    <fieldset>
      <legend>Called Shot</legend>
      <label>
        <input
          type="checkbox"
          checked={shooting.attackOptions.calledShot === 'hand'}
          onChange={() => setCalledShot('hand')}
        />{' '}
        Hand
      </label>
      <label>
        <input
          type="checkbox"
          checked={shooting.attackOptions.calledShot === 'head'}
          onChange={() => setCalledShot('head')}
        />{' '}
        Head
      </label>
      <label>
        <input
          type="checkbox"
          checked={shooting.attackOptions.calledShot === 'helmet'}
          onChange={() => setCalledShot('helmet')}
        />{' '}
        Helmet
      </label>
      <label>
        <input
          type="checkbox"
          checked={shooting.attackOptions.calledShot === 'limbs'}
          onChange={() => setCalledShot('limbs')}
        />{' '}
        Limb
      </label>
      <label>
        <input
          type="checkbox"
          checked={typeof shooting.attackOptions.calledShot === 'number'}
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
