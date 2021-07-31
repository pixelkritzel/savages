import React, { useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Iskill } from 'store/characters/skillModel';
import { IncDec } from 'ui/IncDec';

const GridContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  column-gap: ${({ theme }) => theme.rhythms.inside.horizontal}px; ;
`;

const Custom = styled.div``;

const StyledIncDec = styled(IncDec)`
  margin-left: ${({ theme }) => theme.rhythms.inside.horizontal}px;
  display: inline-block;
`;

export const CalledShot: React.FC<{ attackSkill: Iskill }> = observer(({ attackSkill }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(0);

  function onChangeIsCustom() {
    if (typeof attackSkill.skillOptions.calledShot === 'number') {
      setIsCustom(false);
      attackSkill.skillOptions.set('calledShot', null);
      setCustomValue(0);
    } else {
      setIsCustom(true);
      attackSkill.skillOptions.set('calledShot', customValue);
    }
  }

  function onChangeCustomValue(value: number) {
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
    if (value !== 'custom') {
      setCustomValue(0);
    }
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
          <StyledIncDec
            value={customValue}
            onIncrement={() => onChangeCustomValue(customValue + 1)}
            onDecrement={() => onChangeCustomValue(customValue - 1)}
            disableIncrement={!isCustom || customValue > -1}
            disableDecrement={!isCustom}
          />
          {/* <CustomInput
            type="number"
            disabled={!isCustom}
            value={customValue}
            max={0}
            onChange={onChangeCustomValue}
          /> */}
        </Custom>
      </GridContainer>
    </fieldset>
  );
});
