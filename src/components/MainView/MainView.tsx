import * as React from 'react';
import { observer } from 'mobx-react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { StoreContext } from 'components/StoreContext';
import { Characters } from 'components/Characters';

@observer
export class MainView extends React.Component {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  render() {
    return (
      <Switch>
        <Route path="/characters">
          <Characters />
        </Route>
        <Route path="/">
          <Redirect to="/characters" />>
        </Route>
      </Switch>
    );
  }
}
