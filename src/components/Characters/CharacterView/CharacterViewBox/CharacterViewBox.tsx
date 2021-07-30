import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const StyledBox = styled.div``;

interface CharacterViewBoxProps {
  children: React.ReactNode;
  headline: string | React.ReactNode;
}

const Headline = styled.h3`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.rhythms.inside.vertical};
`;

export const CharacterViewBox = observer(function BoxFn({
  children,
  headline,
  ...otherProps
}: CharacterViewBoxProps) {
  console.log(children);

  return (
    <StyledBox {...otherProps}>
      <Headline>{headline}</Headline>
      {children}
    </StyledBox>
  );
});
