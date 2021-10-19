import React, { HTMLProps, useContext } from 'react';
import styled from 'styled-components';

import { UiContext } from 'ui/UiContext';

const StyledContainer = styled.div<{ isSliderOpen: boolean }>`
  position: relative;
  width: 628px;
  margin: 0 calc((${({ isSliderOpen }) => (isSliderOpen ? '50vw' : '100vw')} - 628px) / 2);
  padding: 0 ${({ theme }) => theme.rhythms.outside.horizontal}px 60px;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

interface ContainerProps extends HTMLProps<HTMLDivElement> {}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  const uiContext = useContext(UiContext);
  return (
    <>
      <StyledContainer isSliderOpen={uiContext.state.isSliderOpen}>{children}</StyledContainer>
      {uiContext.state.isSliderOpen && <Backdrop />}
    </>
  );
};
