import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useRouteMatch } from 'react-router-dom';

import { StoreContext } from 'components/StoreContext';
import { CRUDTable } from 'ui/CRUDTable';

export const SettingsCollection: React.FC = observer(() => {
  const store = React.useContext(StoreContext);
  const match = useRouteMatch();
  console.log(match.url);
  return (
    <CRUDTable
      collection={store.settings}
      baseUrl={match.url}
      newLinkLabel="Create new setting"
      title="Settings"
    />
  );
});
