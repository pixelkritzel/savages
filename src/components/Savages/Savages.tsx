import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from 'components/ErrorBoundary';
import { Layout } from 'components/Layout';
import { StoreContext } from 'components/StoreContext';

import { createStore } from 'store';
import { ThemeProvider } from 'components/ThemeProvider';
import { GlobalStyles } from 'components/GlobalStyles';

export class Savages extends React.Component {
  store = createStore();

  render() {
    if (!this.store) return null;
    return (
      <ErrorBoundary>
        <StoreContext.Provider value={this.store}>
          <BrowserRouter>
            <ThemeProvider>
              <GlobalStyles />
              <Layout />
            </ThemeProvider>
          </BrowserRouter>
        </StoreContext.Provider>
      </ErrorBoundary>
    );
  }
}
