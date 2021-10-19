import React, { useReducer } from 'react';
import { observer } from 'mobx-react';
import immer from 'immer';

import { setIsSliderOpen } from './actions';

type actionTypes = ReturnType<typeof setIsSliderOpen>;

const uiContextState = {
  isSliderOpen: false,
  isInitialised: false,
};

function uiContextReducer(state: typeof uiContextState, action: actionTypes) {
  switch (action.type) {
    case 'setIsSliderOpen':
      return immer(state, (draft) => {
        draft.isSliderOpen = action.data;
      });
  }
}

export const UiContext = React.createContext({
  state: uiContextState,
  dispatch: function (action: actionTypes) {},
});

interface UiContextProps {
  children?: React.ReactNode;
}

export const UiContextProvider = observer(function UiContextFn({
  children,
  ...otherProps
}: UiContextProps) {
  const [state, dispatch] = useReducer(uiContextReducer, uiContextState);

  return (
    <UiContext.Provider value={{ state: { ...state, isInitialised: true }, dispatch }}>
      {children}
    </UiContext.Provider>
  );
});
