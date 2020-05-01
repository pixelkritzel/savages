import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from 'components/ErrorBoundary';
import { MainView } from 'components/MainView';
import { StoreContext } from 'components/StoreContext';

import { createStore } from 'store';

export class Savages extends React.Component {
  store = createStore();

  render() {
    if (!this.store) return null;
    return (
      <ErrorBoundary>
        <StoreContext.Provider value={this.store}>
          <BrowserRouter>
            <MainView />
          </BrowserRouter>
        </StoreContext.Provider>
      </ErrorBoundary>
    );
  }
}
