import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components/macro';

import { Box } from 'ui/Box';

import { Icharacter } from 'store/characters';

interface EdgesProps {
  edges: Icharacter['edges'];
}

const StyledBox = styled(Box)`
  & > *:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.rhythms.inside.vertical}px;
  }
`;

export const Edges: React.FC<EdgesProps> = observer(({ edges, ...otherProps }) => {
  return (
    <div {...otherProps}>
      <StyledBox title="Edges">
        <dl>
          {edges.map(({ _id: id, name, summary }) => (
            <React.Fragment key={id}>
              <dt>
                <strong>{name}</strong>
              </dt>
              <dd>{summary}</dd>
            </React.Fragment>
          ))}
        </dl>
      </StyledBox>
    </div>
  );
});
