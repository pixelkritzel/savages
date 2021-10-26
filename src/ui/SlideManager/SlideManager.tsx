import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components/macro';
import { UiContext } from 'ui/UiContext';
import immer from 'immer';
import { useHistory } from 'react-router';

import { SwitchTransition, Transition, TransitionGroup } from 'react-transition-group';

const SlideInContainer = styled.div<{ isOpen: boolean; isSeveralSlides: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 50vw;
  border-left: 1px solid ${({ theme }) => theme.colors.grays[700]};
  background-color: ${({ theme }) => theme.colors.backgrounds.default};
  padding: ${({ isOpen, isSeveralSlides, theme }) =>
    `${theme.rhythms.outside.vertical}px ${theme.rhythms.outside.horizontal}px ${
      theme.rhythms.outside.vertical
    }px ${
      isSeveralSlides ? theme.rhythms.outside.horizontal + 40 : theme.rhythms.outside.horizontal
    }px`};
  box-shadow: ${({ isOpen }) => (isOpen ? '0 0 3px rgb(0 0 0 / 20%)' : 'none')};
  overflow: scroll;
  transform: translateX(${({ isOpen }) => (isOpen ? 0 : '50vw')});
  transition: transform 0.3s ease-in;
  z-index: 10;
`;
SlideInContainer.displayName = 'SlideInContainer';

const Title = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.rhythms.outside.horizontal}px;
  --width: calc(100vh - ${({ theme }) => theme.rhythms.outside.vertical * 2}px);
  --negative-width: calc(var(--width) * -1);
  width: var(--width);
  top: ${({ theme }) => theme.rhythms.outside.vertical}px;
  transform-origin: 0 0;
  transform: rotate(-90deg) translateX(var(--negative-width));
  text-align: center;
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
  const unblockRef = useRef<ReturnType<typeof history['block']> | null>(null);
  useEffect(() => {
    if (!unblockRef.current) {
      unblockRef.current = history.block();
    }
    if (state.slidesOrder.length === 0 && unblockRef.current) {
      unblockRef.current();
      unblockRef.current = null;
    }
  }, [history, state.slidesOrder.length]);

  const anchorElementRef = useRef(document.createElement('div'));

  const addSlide = useCallback(
    (slideId: string, slide: { element: React.ReactNode; title: string }) => {
      setState((currentState) => ({
        ...currentState,
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
            const indexOfSlideId = currentState.slidesOrder.indexOf(slideId);
            nextState.slidesOrder.splice(indexOfSlideId, 1);
            nextState.activeSlide =
              indexOfSlideId > 0
                ? currentState.slidesOrder[indexOfSlideId - 1]
                : nextState.slidesOrder.length > 0
                ? nextState.slidesOrder[nextState.slidesOrder.length - 1]
                : null;
            delete nextState.slides[slideId];
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

  const slideTitles: Array<{
    slideId: string;
    title: string;
    ref: React.RefObject<HTMLDivElement>;
  }> = useMemo(() => {
    const indexOfActiveSlideInSlidesOrder = state.activeSlide
      ? state.slidesOrder.indexOf(state.activeSlide)
      : 0;
    if (indexOfActiveSlideInSlidesOrder > 0) {
      return state.slidesOrder.slice(0, indexOfActiveSlideInSlidesOrder).map((slideId) => ({
        slideId,
        title: state.slides[slideId].title,
        ref: React.createRef(),
      }));
    } else {
      return [];
    }
  }, [state.activeSlide, state.slides, state.slidesOrder]);

  const sliderManagerContextValue: SlideManageContextType = useMemo(
    () => ({ addSlide, removeSlide }),
    [addSlide, removeSlide]
  );

  const activeSlideRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <SlideManagerContext.Provider value={sliderManagerContextValue}>
        {children}

        {ReactDOM.createPortal(
          <SlideInContainer isOpen={isOpen} isSeveralSlides={state.slidesOrder.length > 0}>
            <TransitionGroup>
              {slideTitles.map(({ ref, slideId, title }) => (
                <Transition
                  nodeRef={ref}
                  in={slideId === state.activeSlide}
                  timeout={300}
                  key={slideId}
                >
                  {(transitionPhase) => <Title ref={ref}>{title}</Title>}
                </Transition>
              ))}
            </TransitionGroup>
            <SwitchTransition>
              <Transition nodeRef={activeSlideRef} in={!!state.activeSlide} timeout={300}>
                <div ref={activeSlideRef}>
                  {state.activeSlide && state.slides[state.activeSlide].element}
                </div>
              </Transition>
            </SwitchTransition>
          </SlideInContainer>,
          anchorElementRef.current
        )}
      </SlideManagerContext.Provider>
    </>
  );
};
