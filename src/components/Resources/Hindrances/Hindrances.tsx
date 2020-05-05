import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewHindrance } from './NewHindrance';

interface HindrancesProps {}

export const Hindrances: React.FC<HindrancesProps> = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        <NewHindrance />{' '}
      </Route>
      <Route path={`${match.path}/:characterId`}>Hindrance Single View</Route>
      <Route path={`${match.path}/`}>Hindrances Collection</Route>
    </Switch>
  );
};
