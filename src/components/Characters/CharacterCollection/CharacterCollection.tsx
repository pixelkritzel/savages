import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useRouteMatch, Link } from 'react-router-dom';

import { StoreContext } from 'components/StoreContext';

export const CharacterCollection: React.FC = observer(() => {
  const store = React.useContext(StoreContext);
  const match = useRouteMatch();

  return (
    <>
      <ul>
        {store.characters.asArray.map(({ id, name }) => (
          <li key={id}>
            <Link to={`${match.url}/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>
      <Link to={`${match.url}/new`}>Create new character</Link>
    </>
  );
});
