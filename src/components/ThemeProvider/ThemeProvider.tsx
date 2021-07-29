import React from 'react';
import { observer } from 'mobx-react';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';

import { theme } from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = observer(function ThemeProviderFn({
  children,
  ...otherProps
}: ThemeProviderProps) {
  return <StyledComponentsThemeProvider theme={theme}>{children}</StyledComponentsThemeProvider>;
});
