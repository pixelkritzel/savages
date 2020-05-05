import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

interface RacesProps {}

export const Races: React.FC<RacesProps> = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>New Race</Route>
      <Route path={`${match.path}/:characterId`}>Single Race View</Route>
      <Route path={`${match.path}/`}>Races Collection</Route>
    </Switch>
  );
};
