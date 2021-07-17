import React from 'react';
import { observer } from 'mobx-react';

import { Itrait } from 'store/characters/traitModel';

interface JokerProps {
  trait: Itrait;
}

export const Joker: React.FC<JokerProps> = observer(({ trait, ...otherProps }) => {
  return (
    <label>
      <input
        type="checkbox"
        checked={trait.isJoker}
        onChange={() => trait.set('isJoker', !trait.isJoker)}
      />{' '}
      Joker
    </label>
  );
});
