import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

export enum BOX_TYPES {
  'info',
  'success',
  'failure',
  'critical_failure',
}

const colors: { [Property in keyof typeof BOX_TYPES]: string } = {
  info: 'white',
  success: 'green',
  failure: 'hsla(20, 100%, 50%, 1)',
  critical_failure: 'red',
};

interface BoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  type: keyof typeof BOX_TYPES;
}

const StyledBox = styled.div<{ type: BoxProps['type'] }>`
  position: relative;
  border: 2px solid ${({ type }) => (type !== 'info' ? colors[type] : 'inherit')};
  padding: 13px 12px 10px;
  margin-top: 12px;
`;

const Title = styled.div<{ type: BoxProps['type'] }>`
  position: absolute;
  left: 8px;
  top: -12px;
  padding: 0 4px;

  background-color: ${({ type }) => (type !== 'info' ? colors[type] : 'white')};
  color: ${({ type }) => (type !== 'info' ? 'white' : 'inherit')};
`;

export const Box = observer(function BoxFn({ children, title, type, ...otherProps }: BoxProps) {
  return (
    <StyledBox type={type} {...otherProps}>
      <Title type={type}>{title}</Title>
      {children}
    </StyledBox>
  );
});
