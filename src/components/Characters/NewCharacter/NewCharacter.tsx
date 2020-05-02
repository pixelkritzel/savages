import React, { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { CharacterForm } from 'components/Characters/CharacterForm';
import { StoreContext } from 'components/StoreContext';

export const NewCharacter: React.FC = () => {
  const { characters } = useContext(StoreContext);
  const history = useHistory();

  const characterRef = useRef(characters.new());

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      NewCharacter
      <button
        onClick={async () => {
          if ((await characters.saveNewCharacter()) === 'SUCCESS') {
            history.replace('/characters');
          }
        }}
        type="button"
      >
        Save Character
      </button>
      <button
        onClick={() => {
          if (window.confirm('Are you sure?')) {
            characters.discardNewCharacter();
            history.replace('/characters');
          }
        }}
        type="button"
      >
        Discard Character
      </button>
      <CharacterForm character={characterRef.current} />
    </form>
  );
};
