import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components/macro';

const Container = styled.pre`
  border: 3px green solid;
  padding: 24px;
  font-family: sans-serif;
`;

interface ShowObjectProps {
  children: any;
}

export const ShowObject: React.FC<ShowObjectProps> = observer(({ children, ...otherProps }) => {
  return <Container {...otherProps}>{JSON.stringify(children, undefined, 4)}</Container>;
});
