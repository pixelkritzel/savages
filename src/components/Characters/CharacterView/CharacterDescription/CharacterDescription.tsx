import React from 'react';
import { observer } from 'mobx-react';
import cx from 'classnames';

import { Checkbox } from 'ui/Checkbox';

import { Icharacter } from 'store/characters';

import { TextLine } from '../TextLine';

import CSS from './CharacterDescription.module.scss';

interface CharacterDescriptionsProps extends React.HTMLProps<HTMLDivElement> {
  character: Icharacter;
  isEdit: boolean;
}

export const CharacterDescription: React.FC<CharacterDescriptionsProps> = observer(
  ({ character, className, isEdit = false }) => (
    <div className={cx(CSS.description, className)}>
      <h3>{character.name}</h3>
      <div className={CSS.container}>
        <TextLine
          isEdit={isEdit}
          label="Race"
          onValueChange={(value) => character.set('race', value)}
          value={character.race}
        />
        <TextLine
          isEdit={isEdit}
          label="Origin"
          onValueChange={(value) => character.set('origin', value)}
          value={character.origin}
        />
        <TextLine
          isEdit={isEdit}
          label="Age"
          onValueChange={(value) => character.set('age', Number(value))}
          value={character.age.toString()}
        />
        <TextLine
          isEdit={isEdit}
          label="Size"
          onValueChange={(value) => character.set('size', Number(value))}
          value={character.size.toString()}
        />
        <TextLine
          isEdit={isEdit}
          label="Bennies"
          onValueChange={(value) => character.set('bennies', Number(value))}
          value={character.bennies.toString()}
        />
        <Checkbox
          type="checkbox"
          label={<strong>Conviction</strong>}
          checked={character.conviction || undefined}
          id="conviction"
          onChange={() => character.set('conviction', !character.conviction)}
        />
      </div>
    </div>
  )
);
