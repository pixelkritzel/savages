import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { ModifiersCollection } from './ModifiersCollection';
import { NewModifier } from './NewModifier';

// import { NewCharacter } from './NewCharacter';

export function Modifiers() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        {' '}
        <NewModifier />{' '}
      </Route>
      <Route path={`${match.path}/:modifierId`}>Modifier View</Route>
      <Route path={`${match.path}/`}>
        <ModifiersCollection />
      </Route>
    </Switch>
  );
}
