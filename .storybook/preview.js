import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { addDecorator } from '@storybook/react';

import { ThemeProvider } from '../src/components/ThemeProvider';
import { UiContextProvider } from '../src/ui/UiContext';
import { SlideManager } from '../src/ui/SlideManager';
import { GlobalStyles } from '../src/components/GlobalStyles';

addDecorator((storyFn) => (
  <div style={{ margin: '16px 32px' }}>
    <UiContextProvider>
      <ThemeProvider>
        <BrowserRouter>
          <SlideManager>
            <GlobalStyles />

            {storyFn()}
          </SlideManager>
        </BrowserRouter>
      </ThemeProvider>
    </UiContextProvider>
  </div>
));
