import * as React from 'react';
import { observer } from 'mobx-react-lite';

import Form from 'react-bootstrap/Form';

import { IncDec } from 'ui/IncDec';
import { SWFormGroup } from 'ui/SWFormGroup/SWFormgroup';

import { Icharacter } from 'store/characters';

export const CharacterForm: React.FC<{ character: Icharacter }> = observer(({ character }) => {
  const { agility, smarts, spirit, strength, vigor } = character.attributes;
  return (
    <div>
      <SWFormGroup controlId="name" label="Name">
        <Form.Control
          type="text"
          placeholder="Character name"
          value={character.name}
          onChange={(event) => character.set('name', event.target.value)}
        />
      </SWFormGroup>

      <hr />
      <h3>Attributes</h3>
      <SWFormGroup controlId="agility-dice" label="Agility">
        <IncDec
          disableDecrement={!agility.isDecrementable}
          disableIncrement={!agility.isIncrementable}
          onDecrement={agility.decrement}
          onIncrement={agility.increment}
          value={agility.value}
        />
      </SWFormGroup>
      <SWFormGroup controlId="smarts-dice" label="Smarts">
        <IncDec
          disableDecrement={!smarts.isDecrementable}
          disableIncrement={!smarts.isIncrementable}
          onDecrement={smarts.decrement}
          onIncrement={smarts.increment}
          value={smarts.value}
        />
      </SWFormGroup>
      <SWFormGroup controlId="spirit-dice" label="Spirit">
        <IncDec
          disableDecrement={!spirit.isDecrementable}
          disableIncrement={!spirit.isIncrementable}
          onDecrement={spirit.decrement}
          onIncrement={spirit.increment}
          value={spirit.value}
        />
      </SWFormGroup>
      <SWFormGroup controlId="strength-dice" label="Strength">
        <IncDec
          disableDecrement={!strength.isDecrementable}
          disableIncrement={!strength.isIncrementable}
          onDecrement={strength.decrement}
          onIncrement={strength.increment}
          value={strength.value}
        />
      </SWFormGroup>
      <SWFormGroup controlId="vigor-dice" label="Vigor">
        <IncDec
          disableDecrement={!vigor.isDecrementable}
          disableIncrement={!vigor.isIncrementable}
          onDecrement={vigor.decrement}
          onIncrement={vigor.increment}
          value={vigor.value}
        />
      </SWFormGroup>
    </div>
  );
});
