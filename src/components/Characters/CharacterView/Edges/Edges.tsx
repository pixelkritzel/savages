import React from 'react';
import { observer } from 'mobx-react';
import { Icharacter } from 'store/characters';

interface EdgesProps {
  edges: Icharacter['edges'];
}

export const Edges: React.FC<EdgesProps> = observer(({ edges, ...otherProps }) => {
  return (
    <div {...otherProps}>
      <h3>Edges</h3>
      <dl>
        {edges.map(({ id, name, summary }) => (
          <React.Fragment key={id}>
            <dt>
              <strong>{name}</strong>
            </dt>
            <dd>{summary}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
});
