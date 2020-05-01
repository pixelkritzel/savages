import * as React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from 'components/StoreContext';
import { Icharacter } from 'store/characters';

@observer
export class Character extends React.Component<{ character: Icharacter }> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  render() {
    const { name } = this.props.character;

    return name;
  }
}
