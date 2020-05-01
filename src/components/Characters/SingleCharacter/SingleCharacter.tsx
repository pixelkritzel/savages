import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router-dom';
import { StoreContext } from 'components/StoreContext';

export const SingleCharacter: React.FC<{}> = observer(function () {
  const { characterId } = useParams();
  const history = useHistory();
  const store = React.useContext(StoreContext);

  const { name } = store.characters.get(characterId);

  return (
    <>
      <button onClick={() => history.goBack()}>back</button>
      Hello, {name}
    </>
  );
});
