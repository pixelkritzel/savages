import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Characters } from 'components/Characters';
import { Resources } from 'components/Resources';
import { Settings } from 'components/Settings';
import { Modifiers } from 'components/Modifiers';
import { Skills } from 'components/Skills';
import { Weapons } from 'components/Weapons';
import { Hindrances } from 'components/Hindrances';
import { Edges } from 'components/Edges';

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
      <Route path="/skills">
        <Skills />
      </Route>
      <Route path="/weapons">
        <Weapons />
      </Route>
      <Route path="/hindrances">
        <Hindrances />
      </Route>
      <Route path="/edges">
        <Edges />
      </Route>
      <Route path="/">{/* <Redirect to="/characters" /> */}</Route>
    </Switch>
  );
}
