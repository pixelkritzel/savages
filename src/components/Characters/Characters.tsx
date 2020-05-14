import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { CharacterCollection } from './CharacterCollection';
import { CharacterView } from './CharacterView';
import { NewCharacter } from './NewCharacter';

export function Characters() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>{/* <NewCharacter /> */}</Route>
      <Route path={`${match.path}/:characterId`}>
        <CharacterView />
      </Route>
      <Route path={`${match.path}/`}>
        <CharacterCollection />
      </Route>
    </Switch>
  );
}
