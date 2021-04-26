import React, { useState } from 'react';

import { BsPencil, BsCheck } from 'react-icons/bs';

import CSS from './Stats.module.scss';

import { Icharacter } from 'store/characters';
import { observer } from 'mobx-react-lite';
import { Button } from 'ui/Button';
import { IncDec } from 'ui/IncDec';
import { Dice } from '../Dice';
import { SWFormGroup } from 'ui/SWFormGroup';

interface StatsProps {
  character: Icharacter;
  isEdit: boolean;
}

export const Stats: React.FC<StatsProps> = observer(({ character, isEdit = false }) => {
  const [isEditPace, setIsEditPace] = useState(isEdit);
  return (
    <div className={CSS.stats}>
      <h3>Stats</h3>
      <SWFormGroup<'div'> as="div" label="Toughness">
        {character.toughness}
      </SWFormGroup>
      <SWFormGroup<'div'> as="div" label="Parry">
        {character.parry}
      </SWFormGroup>
      <SWFormGroup<'div'>
        as="div"
        label={
          <div className="pull-apart">
            <span>Pace</span>
            {isEditPace && (
              <Button icon={<BsCheck />} variant="link" onClick={() => setIsEditPace(false)} />
            )}
          </div>
        }
      >
        <div className="pull-apart">
          {isEditPace ? (
            <IncDec
              disableDecrement={character.pace === 0}
              onIncrement={() => character.set('pace', character.pace + 1)}
              onDecrement={() => character.set('pace', character.pace - 1)}
              value={character.pace}
            />
          ) : (
            <>
              <span>{character.pace}</span>
              <Button icon={<BsPencil />} variant="link" onClick={() => setIsEditPace(true)} />
            </>
          )}
        </div>
      </SWFormGroup>
      <Dice isEdit={isEdit} trait={character.runningDice} />
    </div>
  );
});
