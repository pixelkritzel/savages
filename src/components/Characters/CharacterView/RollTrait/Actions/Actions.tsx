import React from 'react';
import { observer } from 'mobx-react';
import { Itrait } from 'store/characters/traitModel';

interface ActionsProps {
  trait: Itrait;
}

export const Actions: React.FC<ActionsProps> = observer(({ trait, ...otherProps }) => {
  return (
    <>
      <h3>Actions in Turn: {trait.numberOfActions + 1}</h3>
      <input
        type="range"
        min={0}
        max={2}
        step={1}
        value={trait.numberOfActions}
        onChange={(event) => trait.set('numberOfActions', Number(event.target.value))}
        list="numberOfActionsTickmarks"
      />

      <datalist id="numberOfActionsTickmarks">
        <option value="0" label="1"></option>
        <option value="1" label="2"></option>
        <option value="2" label="3"></option>
      </datalist>
    </>
  );
});
