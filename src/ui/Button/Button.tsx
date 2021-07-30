import React from 'react';
import styled, { css } from 'styled-components';

import { focusStyles } from 'utils/focus-styles';

const buttonInnerBorderBoxShadow = 'inset 0px 0px 0px 1px white';

const StyledButton = styled.button<{
  icon?: JSX.Element;
  variant?: 'default' | 'danger' | 'success' | 'link' | 'icon';
}>`
  /** Button reset */

  border: none;
  margin: 0;
  overflow: visible;
  text-align: inherit;
  background: transparent;
  border-radius: 0;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
  display: inline-flex;

  position: relative;
  padding: ${({ variant = 'default' }) =>
    variant === 'link' || variant === 'icon' ? '0' : '2px 6px'};
  text-decoration: ${({ variant = 'default' }) =>
    variant === 'link' ? 'underline' : 'none !important'};
  cursor: ${({ variant = 'default' }) => (variant === 'link' ? 'pointer' : 'auto')};
  border: ${({ theme, variant = 'default' }) =>
    variant === 'link' ? 'none' : `2px solid ${theme.button.colors.border[variant]}`};
  box-shadow: ${buttonInnerBorderBoxShadow};
  transition: all 0.2s;
  background-color: ${({ theme, variant = 'default' }) =>
    theme.button.colors.backgroundColor.normal[variant]};
  color: ${({ theme, variant = 'default' }) => theme.button.colors.textColor[variant]};

  &:disabled {
    border-color: ${({ theme, variant = 'default' }) =>
      theme.button.colors.disabled.borderColor[variant]};
    color: ${({ theme, variant = 'default' }) => theme.button.colors.disabled.textColor[variant]};
    background-color: ${({ theme, variant = 'default' }) =>
      theme.button.colors.disabled.backgroundColor[variant]};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme, variant = 'default' }) =>
      theme.button.colors.backgroundColor.hover[variant]};
    transform: ${({ variant = 'default' }) => (variant === 'link' ? 'none' : 'translate(0, 0)')};
    box-shadow: ${buttonInnerBorderBoxShadow},
      2px 2px 1px ${({ theme }) => theme.button.colors.backgroundColor.hover.default};
  }

  &:active {
    transform: ${({ variant = 'default' }) => (variant === 'link' ? 'none' : 'translate(0, 0)')};
  }

  &:focus {
    outline: none;
    ${focusStyles}
  }
  ${({ variant }) =>
    variant === 'icon'
      ? css`
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          border-width: 1px;
        `
      : ''}
`;

const Inner = styled.span`
  display: inline-block;
`;

const InnerIcon = styled.span`
  display: inline-block;
  margin-right: 6px;
  transform: translate(0, 1px);
`;
interface ButtonProps extends React.ComponentProps<typeof StyledButton> {}

export function Button({ icon, children, ...otherProps }: ButtonProps) {
  return (
    <StyledButton {...otherProps}>
      <Inner>
        {icon && <InnerIcon>{icon}</InnerIcon>}
        {children}
      </Inner>
    </StyledButton>
  );
}
