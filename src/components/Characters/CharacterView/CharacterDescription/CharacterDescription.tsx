import React from 'react';
import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import { Checkbox } from 'ui/Checkbox';

import { Icharacter } from 'store/characters';

import { TextLine } from '../TextLine';

import CSS from './CharacterDescription.module.scss';

export const CharacterDescription: React.FC<{ character: Icharacter; isEdit: boolean }> = observer(
  ({ character, isEdit = false }) => (
    <div className={cx(CSS.description, CSS.box)}>
      <h3>Character</h3>
      <div className={CSS.container}>
        <div className={CSS.childrenSpacing}>
          <TextLine
            isEdit={isEdit}
            label="Name"
            onValueChange={(value) => character.set('name', value)}
            value={character.name}
          />
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
            label="Cryptos"
            onValueChange={(value) => character.set('money', Number(value))}
            value={character.money.toString()}
          />
        </div>
        <div className={CSS.childrenSpacing}>
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
            onChange={() => character.set('conviction', true)}
          />
        </div>
      </div>
    </div>
  )
);
