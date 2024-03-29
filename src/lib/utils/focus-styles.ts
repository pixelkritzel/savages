import { css } from 'styled-components/macro';

export const focusStyles = css`
  & {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: -5px;
      top: -5px;
      width: calc(100% + 10px);
      height: calc(100% + 10px);
      border: 2px dotted #62778a;
    }
  }
`;
