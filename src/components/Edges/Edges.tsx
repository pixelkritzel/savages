import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { EditEdge } from './EditEdge';
import { EdgesCollection } from './EdgesCollection';
import { NewEdge } from './NewEdge';
import { EdgeView } from './EdgeView';

// import { NewCharacter } from './NewCharacter';

export function Edges() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        <NewEdge />
      </Route>
      <Route path={`${match.path}/:edgeId/edit`}>
        <EditEdge />
      </Route>
      <Route path={`${match.path}/:edgeId`}>
        <EdgeView />
      </Route>

      <Route path={`${match.path}/`}>
        <EdgesCollection />
      </Route>
    </Switch>
  );
}
