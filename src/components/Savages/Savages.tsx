import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { ErrorBoundary } from 'components/ErrorBoundary';
import { Layout } from 'components/Layout';
import { StoreContext } from 'components/StoreContext';

import { createStore } from 'store';
import { ThemeProvider } from 'components/ThemeProvider';
import { GlobalStyles } from 'components/GlobalStyles';
import { UiContextProvider } from 'ui/UiContext';
import { SlideManager } from 'ui/SlideManager';

@observer
export class Savages extends React.Component {
  store = createStore();

  render() {
    if (!this.store) return null;
    return (
      <ErrorBoundary>
        <StoreContext.Provider value={this.store}>
          <UiContextProvider>
            <ThemeProvider>
              <SlideManager>
                <BrowserRouter>
                  <GlobalStyles />
                  {this.store.isAllLoaded && <Layout />}
                </BrowserRouter>
              </SlideManager>
            </ThemeProvider>
          </UiContextProvider>
        </StoreContext.Provider>
      </ErrorBoundary>
    );
  }
}
