import React, { HTMLProps } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  width: 628px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.rhythms.outside.horizontal}px 60px;
`;

interface ContainerProps extends HTMLProps<HTMLDivElement> {}

export const Container: React.FC<ContainerProps> = ({ children }) => (
  <StyledContainer>{children}</StyledContainer>
);
