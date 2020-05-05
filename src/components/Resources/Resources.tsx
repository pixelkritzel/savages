import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { Hindrances } from './Hindrances';
import { Races } from './Races';

export function Resources() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/hindrances`}>
        <Hindrances />
      </Route>
      <Route path={`${match.path}/races`}>
        <Races />
      </Route>
      s{' '}
    </Switch>
  );
}
