import React from 'react';

import { addDecorator } from '@storybook/react';

import { ThemeProvider } from '../src/components/ThemeProvider';
import { GlobalStyles } from '../src/components/GlobalStyles';

addDecorator((storyFn) => (
  <div style={{ margin: '16px 32px' }}>
    <ThemeProvider>
      <GlobalStyles /> {storyFn()}
    </ThemeProvider>
  </div>
));
