import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'components/StoreContext';
import { CRUDTable } from 'ui/CRUDTable';

export const CharacterCollection: React.FC = observer(() => {
  const store = React.useContext(StoreContext);
  const match = useRouteMatch();

  return (
    <CRUDTable
      collection={store.characters}
      baseUrl={match.url}
      newLinkLabel="Create new character"
      title="Characters"
    />
  );
});
