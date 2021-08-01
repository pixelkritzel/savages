import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Box } from 'ui/Box';

import { Ihindrance } from 'store/settings/settingHindranceModel';

const StyledBox = styled(Box)`
  ul {
    list-style: none;
    padding: 0;
  }
`;

const Hindrance = styled.li`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: space-between;

  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.rhythms.inside.vertical}px;
  }
`;

const Summary = styled.div`
  grid-column: 1 / span 2;
`;

interface HindrancesProps {
  hindrances: Ihindrance[];
}

export const Hindrances: React.FC<HindrancesProps> = observer(({ hindrances, ...otherProps }) => {
  return (
    <StyledBox title="Hindrances">
      <ul>
        {hindrances.map(({ _id: id, impact, name, summary }) => (
          <Hindrance key={id}>
            <strong>{name}</strong> <span>{impact}</span>
            <Summary>{summary}</Summary>
          </Hindrance>
        ))}
      </ul>
    </StyledBox>
  );
});
