import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { SettingsCollection } from './SettingsCollection';
import { NewSetting } from './NewSetting';
import { SingleSetting } from './SingleSetting';

export function Settings() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        <NewSetting />
      </Route>
      <Route path={`${match.path}/:settingId`}>
        <SingleSetting />
      </Route>
      <Route path={`${match.path}/`}>
        <SettingsCollection />
      </Route>
    </Switch>
  );
}
