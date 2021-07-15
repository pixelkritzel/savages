import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router-dom';

import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';

import { Attributes } from './Attributes';
import { CharacterDescription } from './CharacterDescription';
import { Health } from './Health';
import { Stats } from './Stats';
import { Money } from './Money';
import { Skills } from './Skills';
import { Powers } from './Powers';

import CSS from './CharacterView.module.scss';

export const CharacterView: React.FC<{}> = observer(function () {
  const { characterId } = useParams<{ characterId: string }>();
  const history = useHistory();
  const store = React.useContext<Istore>(StoreContext);
  const character = store.characters.find((character) => character.id === characterId);

  if (!character) {
    throw new Error(`Character ${characterId} wasn't found!`);
  }

  const isEdit = false;

  return (
    <div className={CSS.characterView}>
      <CharacterDescription className={CSS.description} character={character} isEdit={isEdit} />
      <div className={CSS.left}>
        <Money isEdit={isEdit} character={character} />
        <Health character={character} />
        <Attributes isEdit={isEdit} character={character} />
        <Stats character={character} isEdit={isEdit} />
        <div>edges</div>
        <div>hindrances</div>
        <div>tap</div>
      </div>
      <div className={CSS.right}>
        <Skills character={character} />
        <Powers />
        <div>weapons</div>
        <div>augmentations</div>
        <div>gear</div>
        <div>drone</div>
        <div>vehicle</div>
      </div>
      <div className={CSS.contacts}>contacts</div>
      <div className={CSS.notes}>notes</div>
    </div>
  );
});
