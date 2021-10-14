import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { EditRace } from './EditRace';
import { RacesCollection } from './RacesCollection';
import { NewRace } from './NewRace';

// import { NewCharacter } from './NewCharacter';

export function Races() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        <NewRace />
      </Route>
      <Route path={`${match.path}/:raceId/edit`}>
        <EditRace />
      </Route>
      <Route path={`${match.path}/:raceId`}>
        <EditRace />
      </Route>

      <Route path={`${match.path}/`}>
        <RacesCollection />
      </Route>
    </Switch>
  );
}
