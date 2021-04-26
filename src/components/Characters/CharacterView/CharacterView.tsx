import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router-dom';

import { StoreContext } from 'components/StoreContext';

import { characterModel } from 'store/characters';

import CSS from './CharacterView.module.scss';

import { Attributes } from './Attributes';
import { CharacterDescription } from './CharacterDescription';
import { Health } from './Health';

import { single_character_mock } from './single_character_mock';
import { Stats } from './Stats';

export const CharacterView: React.FC<{}> = observer(function () {
  const { characterId } = useParams<{ characterId: string }>();
  const history = useHistory();
  const store = React.useContext(StoreContext);

  const character = characterModel.create(single_character_mock);
  console.log(character);

  const isEdit = true;

  return (
    <div className={CSS.characterView}>
      <Attributes isEdit={isEdit} attributes={character.attributes} />
      <CharacterDescription character={character} isEdit={isEdit} />
      <Health character={character} />

      <div className={CSS.left}>
        <Stats character={character} isEdit={isEdit} />
        <div className={CSS.armor}>armor</div>
        <div className={CSS.skills}>skills</div>
        <div className={CSS.hindrances}>hindrances</div>
        <div className={CSS.tap}>tap</div>
      </div>
      <div className={CSS.edges}>edges</div>
      <div className={CSS.weapons}>weapons</div>
      <div className={CSS.augmentations}>augmentations</div>
      <div className={CSS.gear}>gear</div>
      <div className={CSS.drone}>drone</div>
      <div className={CSS.vehicle}>vehicle</div>
      <div className={CSS.psi}>psi</div>
      <div className={CSS.contacts}>contacts</div>
      <div className={CSS.notes}>notes</div>
    </div>
  );
});
