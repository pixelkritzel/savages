import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { EditSetting } from './EditSetting';
import { SettingsCollection } from './SettingsCollection';
import { NewSetting } from './NewSetting';

// import { NewCharacter } from './NewCharacter';

export function Settings() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        <NewSetting />
      </Route>
      <Route path={`${match.path}/:settingId/edit`}>
        <EditSetting />
      </Route>
      <Route path={`${match.path}/:settingId`}>
        <EditSetting />
      </Route>

      <Route path={`${match.path}/`}>
        <SettingsCollection />
      </Route>
    </Switch>
  );
}
