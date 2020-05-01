import * as React from 'react';

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
          <MainView />
        </StoreContext.Provider>
      </ErrorBoundary>
    );
  }
}
