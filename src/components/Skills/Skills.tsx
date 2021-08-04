import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { EditSkill } from './EditSkill';
import { SkillsCollection } from './SkillsCollection';
import { NewSkill } from './NewSkill';

export function Skills() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/new`}>
        <NewSkill />
      </Route>
      <Route path={`${match.path}/:skillId/edit`}>
        <EditSkill />
      </Route>
      <Route path={`${match.path}/:skillId`}>
        <EditSkill />
      </Route>

      <Route path={`${match.path}/`}>
        <SkillsCollection />
      </Route>
    </Switch>
  );
}
