import styled, { css } from 'styled-components/macro';

export const formGrid = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: ${({ theme }) => theme.rhythms.outside.horizontal}px;
  row-gap: ${({ theme }) => theme.rhythms.outside.vertical}px;
`;

export const TwoColumns = styled.div`
  grid-column: 1 / span 2;
  display: grid;
  row-gap: ${({ theme }) => theme.rhythms.outside.vertical}px;
`;
