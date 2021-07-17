import React from 'react';
import { observer } from 'mobx-react';
import { Ihindrance } from 'store/settings/settingHindranceModel';

interface HindrancesProps {
  hindrances: Ihindrance[];
}

export const Hindrances: React.FC<HindrancesProps> = observer(({ hindrances, ...otherProps }) => {
  return (
    <ul>
      {hindrances.map(({ id, impact, name, summary }) => (
        <li key={id}>
          <strong>{name}</strong> <span>{impact}</span>
          <span>{summary}</span>
        </li>
      ))}
    </ul>
  );
});
