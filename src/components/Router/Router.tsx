import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { Characters } from 'components/Characters';
import { Settings } from 'components/Settings';

export function Router() {
  return (
    <Switch>
      <Route path="/characters">
        <Characters />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="/">
        <Redirect to="/characters" />>
      </Route>
    </Switch>
  );
}
