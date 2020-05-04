import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { SettingsCollection } from './SettingsCollection';

export function Settings() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        <div>New Setting</div>
      </Route>
      <Route path={`${match.path}/:settingId`}>
        <div>Single Setting View</div>
      </Route>
      <Route path={`${match.path}/`}>
        <SettingsCollection />
      </Route>
    </Switch>
  );
}
