import React from 'react';
import { observer } from 'mobx-react';
import styled, { css } from 'styled-components';
import { IReactComponent } from 'mobx-react/dist/types/IReactComponent';

export type BOX_TYPES = 'info' | 'success' | 'warning' | 'danger';

const boxStyles = css<{ type: BOX_TYPES }>`
  position: relative;
  border: 2px solid ${({ theme, type }) => theme.box.borderColors[type]};
  padding: 16px 12px 10px;
  margin-top: 12px;
`;

const titleStyles = css<{ type: BOX_TYPES }>`
  position: absolute;
  left: 8px;
  top: -12px;
  padding: 0 4px;
  background-color: ${({ theme, type }) => theme.box.titleBackgroundColor[type]};
  color: ${({ type }) => (type !== 'info' ? 'white' : 'inherit')};
`;

const StyledFieldset = styled.fieldset<{ type: BOX_TYPES }>`
  ${boxStyles}
`;

const StyledBox = styled.div<{ type: BOX_TYPES }>`
  ${boxStyles}
`;

const StyledLegend = styled.legend<{ type: BOX_TYPES }>`
  ${titleStyles}
`;

const StyledTitle = styled.div<{ type: BOX_TYPES }>`
  ${titleStyles}
`;

interface BoxProps extends React.ComponentPropsWithoutRef<typeof StyledBox> {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  type?: BOX_TYPES;
  asFieldset?: boolean;
}

export const Box = observer(function BoxFn({
  asFieldset = false,
  children,
  title,
  type = 'info',
  ...otherProps
}: BoxProps) {
  const Box = (asFieldset ? StyledFieldset : StyledBox) as IReactComponent;
  const Title = (asFieldset ? StyledLegend : StyledTitle) as IReactComponent;

  return (
    <Box type={type} {...otherProps}>
      <Title type={type}>{title}</Title>
      {children}
    </Box>
  );
});
