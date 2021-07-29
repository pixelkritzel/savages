import React, { useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Iskill } from 'store/characters/skillModel';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  row-gap: ${({ theme }) => theme.rhythms.vertical};
  column-gap: ${({ theme }) => theme.rhythms.hoizontal};
`;

const Custom = styled.div`
  white-space: nowrap;
`;

const CustomInput = styled.input`
  margin-left: 8px;
  min-width: 48px;
  max-width: 48px;
  text-align: right;
`;

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
    if (value <= 0) {
      setCustomValue(value);
      attackSkill.skillOptions.set('calledShot', value);
    }
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
      <GridContainer>
        <label>
          <input
            type="checkbox"
            checked={attackSkill.skillOptions.calledShot === 'hand'}
            onChange={() => setCalledShot('hand')}
          />{' '}
          Hand (-2)
        </label>
        <label>
          <input
            type="checkbox"
            checked={attackSkill.skillOptions.calledShot === 'head'}
            onChange={() => setCalledShot('head')}
          />{' '}
          Head (-4)
        </label>
        <label>
          <input
            type="checkbox"
            checked={attackSkill.skillOptions.calledShot === 'helmet'}
            onChange={() => setCalledShot('helmet')}
          />{' '}
          Helmet (-5)
        </label>
        <label>
          <input
            type="checkbox"
            checked={attackSkill.skillOptions.calledShot === 'limbs'}
            onChange={() => setCalledShot('limbs')}
          />{' '}
          Limb (-2)
        </label>
        <Custom>
          <label>
            <input
              type="checkbox"
              checked={typeof attackSkill.skillOptions.calledShot === 'number'}
              onChange={onChangeIsCustom}
            />{' '}
            Custom
          </label>
          <CustomInput
            type="number"
            disabled={!isCustom}
            value={customValue}
            max={0}
            onChange={onChangeCustomValue}
          />
        </Custom>
      </GridContainer>
    </fieldset>
  );
});
