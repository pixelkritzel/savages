import React, { useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const SlideInContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: ${({ isOpen }) => (isOpen ? '50vw' : 0)};
  border-left: 1px solid ${({ theme }) => theme.colors.grays[700]};
  background-color: ${({ theme }) => theme.colors.backgrounds.default};
  padding: ${({ isOpen, theme }) =>
    isOpen ? `${theme.rhythms.outside.vertical}px ${theme.rhythms.outside.horizontal}px` : 0};
  box-shadow: ${({ isOpen }) => (isOpen ? '0 0 3px rgb(0 0 0 / 20%)' : 'none')};
  overflow: scroll;
  transition: width 0.8s ease-in;
`;

interface SlideInProps {
  id: string;
  duration?: number;
  isOpen?: boolean;
  children?: React.ReactNode;
}

export const SlideIn = observer(function SlideInFn({
  id,
  duration = 300,
  isOpen = false,
  children,
  ...otherProps
}: SlideInProps) {
  const anchorElementRef = useRef(document.createElement('div'));

  useEffect(() => {
    const anchorElement = anchorElementRef.current;
    document.body.append(anchorElement);
    return () => {
      anchorElement.remove();
    };
  }, []);

  return ReactDOM.createPortal(
    <SlideInContainer isOpen={isOpen}>{children}</SlideInContainer>,

    anchorElementRef.current
  );
});
