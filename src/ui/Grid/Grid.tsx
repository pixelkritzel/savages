import React from 'react';
import styled, { css } from 'styled-components';

export const gridStyles = css<{
  inline?: boolean;
  spacing?: 'inside' | 'outside';
  vertical?: 'start' | 'end' | 'center' | 'stretch';
  horizontal?: 'start' | 'end' | 'center' | 'stretch';
}>`
  display: ${({ inline }) => (inline ? 'inline-grid' : 'grid')};
  width: ${({ inline }) => !inline && '100%'};
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-gap: ${({ theme, spacing = 'outside' }) => theme.rhythms[spacing].vertical}px
    ${({ theme, spacing = 'outside' }) => theme.rhythms[spacing].horizontal}px;
  justify-items: ${({ horizontal = 'auto' }) => horizontal};
  align-items: ${({ horizontal = 'auto' }) => horizontal};
`;

export const Grid = styled.div`
  ${gridStyles}
`;

export const gridSpanStyles = css<{
  start?: number;
  end?: number;
  vertical?: 'start' | 'end' | 'center' | 'stretch';
  horizontal?: 'start' | 'end' | 'center' | 'stretch';
  row?: number;
}>`
  grid-column: ${({ start = 1 }) => start} / ${({ end = 13 }) => end};
  grid-row: ${({ row = 'auto' }) => row};
  justify-self: ${({ horizontal = 'auto' }) => horizontal};
  align-self: ${({ vertical = 'auto' }) => vertical};
`;

const StyledSpan = styled.div`
  ${gridSpanStyles}
`;

interface SpanProps extends React.ComponentProps<typeof StyledSpan> {}

export function Span({ children, ...otherProps }: SpanProps) {
  return <StyledSpan {...otherProps}>{children}</StyledSpan>;
}

export const flexStyles = css<{
  inline?: boolean;
  spacing?: 'inside' | 'outside';
  vertical?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  horizontal?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}>`
  display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
  gap: ${({ theme, spacing = 'outside' }) => theme.rhythms[spacing].vertical}px
    ${({ theme, spacing = 'outside' }) => theme.rhythms[spacing].horizontal}px;
  flex-wrap: wrap;
  justify-content: ${({ horizontal = 'auto' }) => horizontal};
  align-items: ${({ vertical = 'auto' }) => vertical};
`;

export const Flex = styled.div`
  ${flexStyles}
`;
