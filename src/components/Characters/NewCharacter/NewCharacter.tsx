import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import { Button } from 'ui/Button';

// import { CharacterForm } from 'components/Characters/CharacterForm';
import { StoreContext } from 'components/StoreContext';

export const NewCharacter: React.FC = observer(() => {
  const history = useHistory();
  const { characters } = useContext(StoreContext);

  useEffect(() => {
    characters.new();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <h2>Create a new character</h2>

      {/* <CharacterForm character={characters.newModel!} /> */}

      <div className="pull-right">
        <Button
          onClick={() => {
            if (window.confirm('Are you sure?')) {
              characters.discardNewModel();
              history.replace(`/characters`);
            }
          }}
          type="button"
        >
          Discard Character
        </Button>
        <Button
          onClick={async () => {
            if (characters.newModel!.errors.length > 0 && !characters.newModel!.showErrors) {
              characters.newModel!.set('showErrors', true);
              return;
            }
            if (characters.newModel!.ignoreErrors) {
              characters.newModel!.addLogEntry(
                `Created character with existing errors:\n${characters.newModel!.errors.join('\n')}`
              );
            }
            if ((await characters.saveNewModel()) === 'SUCCESS') {
              history.replace(`/characters`);
            }
          }}
          type="button"
        >
          Save character
        </Button>
      </div>
    </form>
  );
});
