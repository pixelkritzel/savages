import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { EditWeapon } from './EditWeapon';
import { WeaponsCollection } from './WeaponsCollection';
import { NewWeapon } from './NewWeapon';

// import { NewCharacter } from './NewCharacter';

export function Weapons() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        <NewWeapon />
      </Route>
      <Route path={`${match.path}/:weaponId/edit`}>
        <EditWeapon />
      </Route>
      <Route path={`${match.path}/:weaponId`}>
        <EditWeapon />
      </Route>

      <Route path={`${match.path}/`}>
        <WeaponsCollection />
      </Route>
    </Switch>
  );
}
