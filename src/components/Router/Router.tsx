import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { Characters } from 'components/Characters';
import { Resources } from 'components/Resources';
import { Settings } from 'components/Settings';
import { Modifiers } from 'components/Modifiers';

export function Router() {
  return (
    <Switch>
      <Route path="/characters">
        <Characters />
      </Route>
      <Route path="/resources">
        <Resources />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="/modifiers">
        <Modifiers />
      </Route>
      <Route path="/">
        <Redirect to="/characters" />
      </Route>
    </Switch>
  );
}
