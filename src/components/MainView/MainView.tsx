import * as React from 'react';
import { observer } from 'mobx-react';

import { Character } from 'components/Character';
import { StoreContext } from 'components/StoreContext';

@observer
export class MainView extends React.Component {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  render() {
    console.log(this.context);
    return <Character character={this.context.characters.get('0')} />;
  }
}
