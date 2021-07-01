import React from 'react';
import { observer } from 'mobx-react';

import { Icharacter } from 'store/characters';
import { TextLine } from '../TextLine';

interface MoneyProps extends React.HTMLProps<HTMLDivElement> {
  character: Icharacter;
  isEdit: boolean;
}

@observer
export class Money extends React.Component<MoneyProps> {
  render() {
    const { character, isEdit } = this.props;

    return (
      <TextLine
        isEdit={isEdit}
        label="Money"
        onValueChange={(value) => character.set('money', Number(value))}
        value={character.money.toString()}
      />
    );
  }
}
