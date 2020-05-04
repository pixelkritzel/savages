import React, { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { CharacterForm } from 'components/Characters/CharacterForm';
import { StoreContext } from 'components/StoreContext';

export const NewCharacter: React.FC = () => {
  const { characters } = useContext(StoreContext);
  const history = useHistory();

  const characterRef = useRef(characters.new());

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <h2>Create a new character</h2>
      <CharacterForm character={characterRef.current} />

      <div className="pull-right">
        <ButtonGroup>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('Are you sure?')) {
                characters.discardNewModel();
                history.replace('/characters');
              }
            }}
            type="button"
          >
            Discard Character
          </Button>
          <Button
            onClick={async () => {
              if ((await characters.saveNewModel()) === 'SUCCESS') {
                history.replace('/characters');
              }
            }}
            type="button"
          >
            Save Character
          </Button>
        </ButtonGroup>
      </div>
    </form>
  );
};
