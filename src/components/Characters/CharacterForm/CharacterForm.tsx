import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Input } from 'ui/Input';
import { IncDec } from 'ui/IncDec';

import { Icharacter } from 'store/characters';

export const CharacterForm: React.FC<{ character: Icharacter }> = observer(({ character }) => {
  const { agility, smarts, spirit, strength, vigor } = character.attributes;
  return (
    <div>
      <Input
        labelContent="Name"
        name="name"
        value={character.name}
        onValueChange={(value) => character.set('name', value)}
      />
      <fieldset>
        <legend>Attributes</legend>
        <IncDec
          disableDecrement={!agility.isDecrementable}
          disableIncrement={!agility.isIncrementable}
          labelContent="Agility"
          onDecrement={agility.decrement}
          onIncrement={agility.increment}
          value={agility.value}
        />

        <IncDec
          disableDecrement={!smarts.isDecrementable}
          disableIncrement={!smarts.isIncrementable}
          labelContent="Smarts"
          onDecrement={smarts.decrement}
          onIncrement={smarts.increment}
          value={smarts.value}
        />
        <IncDec
          disableDecrement={!spirit.isDecrementable}
          disableIncrement={!spirit.isIncrementable}
          labelContent="Spirit"
          onDecrement={spirit.decrement}
          onIncrement={spirit.increment}
          value={spirit.value}
        />
        <IncDec
          disableDecrement={!strength.isDecrementable}
          disableIncrement={!strength.isIncrementable}
          labelContent="Strength"
          onDecrement={strength.decrement}
          onIncrement={strength.increment}
          value={strength.value}
        />
        <IncDec
          disableDecrement={!vigor.isDecrementable}
          disableIncrement={!vigor.isIncrementable}
          labelContent="Vigor"
          onDecrement={vigor.decrement}
          onIncrement={vigor.increment}
          value={vigor.value}
        />
      </fieldset>
    </div>
  );
});
