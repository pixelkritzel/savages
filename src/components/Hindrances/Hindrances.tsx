import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { EditHindrance } from './EditHindrance';
import { HindrancesCollection } from './HindrancesCollection';
import { NewHindrance } from './NewHindrance';

// import { NewCharacter } from './NewCharacter';

export function Hindrances() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        <NewHindrance />
      </Route>
      <Route path={`${match.path}/:hindranceId/edit`}>
        <EditHindrance />
      </Route>
      <Route path={`${match.path}/:hindranceId`}>
        <EditHindrance />
      </Route>

      <Route path={`${match.path}/`}>
        <HindrancesCollection />
      </Route>
    </Switch>
  );
}
