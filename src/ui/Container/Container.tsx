import React, { HTMLProps } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  width: 628px;
  margin: 0 auto;
`;

interface ContainerProps extends HTMLProps<HTMLDivElement> {}

export const Container: React.FC<ContainerProps> = ({ children }) => (
  <StyledContainer>{children}</StyledContainer>
);
