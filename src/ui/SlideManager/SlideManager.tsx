import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { ReactNode } from 'react-router/node_modules/@types/react';
import styled from 'styled-components/macro';
import { UiContext } from 'ui/UiContext';
import immer from 'immer';
import { useHistory } from 'react-router';

const SlideInContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: ${({ isOpen }) => (isOpen ? '50vw' : 0)};
  border-left: 1px solid ${({ theme }) => theme.colors.grays[700]};
  background-color: ${({ theme }) => theme.colors.backgrounds.default};
  padding: ${({ isOpen, theme }) =>
    isOpen ? `${theme.rhythms.outside.vertical}px ${theme.rhythms.outside.horizontal}px` : 0};
  box-shadow: ${({ isOpen }) => (isOpen ? '0 0 3px rgb(0 0 0 / 20%)' : 'none')};
  overflow: scroll;
  transition: width 0.8s ease-in;
  z-index: 10;
`;

SlideInContainer.displayName = 'SlideInContainer';

const Toggle = styled.div<{ isShown: boolean }>`
  display: ${({ isShown }) => (isShown ? 'unset' : 'none')};
`;

type SlideManageContextType = {
  addSlide: (slideId: string, slide: { element: React.ReactNode; title: string }) => void;
  removeSlide: (slideId: string) => void;
};

export const SlideManagerContext = React.createContext({} as SlideManageContextType);

interface SlideManagerProps {
  children?: React.ReactNode;
}

export const SlideManager = function SlideManagerFn({
  children,
  ...otherProps
}: SlideManagerProps) {
  const uiContext = useContext(UiContext);
  const [state, setState] = useState<{
    activeSlide: string | null;
    slides: Record<string, { element: React.ReactNode; title: string }>;
    slidesOrder: string[];
  }>({
    activeSlide: null,
    slides: {},
    slidesOrder: [],
  });

  const history = useHistory();
  useEffect(() => {
    const unblock = history.block();
    if (state.slidesOrder.length === 0) {
      unblock();
    }
  });

  const anchorElementRef = useRef(document.createElement('div'));

  const addSlide = useCallback(
    (slideId: string, slide: { element: React.ReactNode; title: string }) => {
      setState((currentState) => ({
        activeSlide: slideId,
        slides: { ...currentState.slides, [slideId]: slide },
        slidesOrder: !currentState.slidesOrder.includes(slideId)
          ? [...currentState.slidesOrder, slideId]
          : [...currentState.slidesOrder],
      }));
    },
    []
  );

  const removeSlide = useCallback(
    (slideId: string) => {
      if (state.slidesOrder.includes(slideId)) {
        setState((currentState) => {
          return immer(currentState, (nextState) => {
            const indexOfSlideId = nextState.slidesOrder.indexOf(slideId);
            nextState.activeSlide =
              indexOfSlideId > 0 ? currentState.slidesOrder[indexOfSlideId - 1] : null;
            delete nextState.slides[slideId];
            nextState.slidesOrder.splice(indexOfSlideId, 1);
          });
        });
      }
    },
    [state.slidesOrder]
  );

  useEffect(() => {
    const anchorElement = anchorElementRef.current;
    document.body.append(anchorElement);
    return () => {
      anchorElement.remove();
    };
  }, []);

  const isOpen = !!state.slidesOrder.length;

  useEffect(() => uiContext.dispatch({ type: 'setIsSliderOpen', data: isOpen }));

  const sliderManagerContextValue: SlideManageContextType = useMemo(
    () => ({ addSlide, removeSlide }),
    [addSlide, removeSlide]
  );

  return (
    <>
      <SlideManagerContext.Provider value={sliderManagerContextValue}>
        {children}

        {ReactDOM.createPortal(
          <SlideInContainer isOpen={isOpen}>
            {state.slidesOrder.map((slideId) => (
              <div key={slideId}>
                <div>
                  <Toggle isShown={slideId !== state.activeSlide}>
                    {state.slidesOrder.length > 0 && state.slides[slideId].title}
                  </Toggle>
                  <Toggle isShown={slideId === state.activeSlide}>
                    {state.slides[slideId].element}
                  </Toggle>
                </div>
              </div>
            ))}
          </SlideInContainer>,
          anchorElementRef.current
        )}
      </SlideManagerContext.Provider>
    </>
  );
};
