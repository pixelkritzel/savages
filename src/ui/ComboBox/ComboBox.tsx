import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import throttle from 'lodash/throttle';

import { Input } from 'ui/Input';

import { generateId } from 'lib/utils/generateId';
import { theme } from 'components/ThemeProvider/theme';

const LIST_BOX_OFFSET = 2;

const ComboBoxContainer = styled.div`
  position: relative;
`;

type PopoutProps = {
  height?: string;
  verticalAnchor: 'top' | 'bottom';
};

const Popout = styled.div<PopoutProps>`
  position: absolute;
  border: 1px solid ${({ theme }) => theme.colors.grays[600]};
  width: 100%;
  height: ${({ height = 'auto' }) => height};
  top: ${({ verticalAnchor }) => verticalAnchor === 'top' && `calc(100% + ${LIST_BOX_OFFSET}px)`};
  bottom: ${({ verticalAnchor }) =>
    verticalAnchor === 'bottom' && `calc(100% + ${LIST_BOX_OFFSET}px)`};
  box-shadow: ${({ theme }) => theme.shadows.default};
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: ${({ theme }) => theme.colors.backgrounds.default};
  z-index: 10;
`;

type ResultsListProps = {
  noOfItems: number;
  itemHeight: string;
  activeItemIndicatorOffset: string;
};

const ResultsList = styled.ul<ResultsListProps>`
  position: relative;
  display: ${({ noOfItems }) => (noOfItems > 0 ? 'flex' : 'none')};
  flex-direction: column;

  &:before {
    content: '';
    position: absolute;
    height: ${({ itemHeight }) => itemHeight};
    width: 6px;
    left: 0px;
    top: ${({ activeItemIndicatorOffset }) => activeItemIndicatorOffset};
    background-color: cornflowerblue;
    transition: top 0.1s;
  }
`;

const StyledListItem = styled.li<{ isActive: boolean }>`
  padding: ${({ theme }) => theme.input.padding.default};

  cursor: default;

  &:hover {
    background-color: lightblue;
  }
`;

const NoResults = styled.div`
  padding: ${({ theme }) => theme.input.padding.default};
  text-align: center;
  font-style: italic;
`;

export type ComboBoxProps = Omit<JSX.IntrinsicElements['input'], 'ref'> & {
  items: {
    value: string;
    display: string | { component: React.ReactNode; searchableText: string };
  }[];
  labelId: string;
  noResultsMessage?: string;
  onHide?: () => void;
  onValueSelect?: (value: string, index: number) => void;
};

const COMBO_BOX_INITIAL_STATE = {
  inputText: '',
  filteredItems: [] as ComboBoxProps['items'],
  activeItemIndex: -1,
};

export const ComboBox = function ComboBoxFn({
  id,
  items,
  labelId,
  noResultsMessage = 'No Results',
  onHide,
  onValueSelect,
  ...otherProps
}: ComboBoxProps) {
  const [state, setState] = useState(COMBO_BOX_INITIAL_STATE);
  const [poputHeight, setPopoutHeight] = useState<number>(-1);
  const [resultsListItemHeight, setResultsListItemHeight] = useState<number>(-1);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isPopoutOpen, setPopoutOpen] = useState(false);
  const [popoutVerticalAnchor, setpopoutVerticalAnchor] = useState<PopoutProps['verticalAnchor']>(
    'top'
  );

  const activeItemIndicatorOffset = useMemo(() => state.activeItemIndex * resultsListItemHeight, [
    resultsListItemHeight,
    state.activeItemIndex,
  ]);

  const ids = useMemo(
    () => ({
      popout: generateId('results-list'),
      resultsListItem: generateId('results-list-item'),
    }),
    []
  );

  const closeResultsList = useCallback(() => {
    setState(COMBO_BOX_INITIAL_STATE);
    setPopoutOpen(false);
    onHide && onHide();
  }, [onHide]);

  const containerRef = useRef<HTMLDivElement>(null);
  const popoutRef = useRef<HTMLDivElement>(null);
  const resultsListRef = useRef<HTMLUListElement>(null);
  const resultsListItemRef = useRef<HTMLLIElement>(null);

  const checkBlur = useMemo(
    () => (event: FocusEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeResultsList();
      }
    },
    [closeResultsList]
  );

  const checkClick = useMemo(
    () => (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeResultsList();
      }
    },
    [closeResultsList]
  );

  const selectItem = useCallback(
    (index) => {
      const { display, value: selectedValue } = state.filteredItems[index];
      setState({
        ...COMBO_BOX_INITIAL_STATE,
        inputText: typeof display === 'string' ? display : display.searchableText,
      });

      if (onValueSelect) {
        const originalIndex = items.findIndex(
          ({ value: itemValue }) => itemValue === selectedValue
        );
        onValueSelect(selectedValue, originalIndex);
      }
    },
    [items, onValueSelect, state.filteredItems]
  );

  const updateResults = useCallback(() => {
    const lowerCaseInputText = state.inputText.toLowerCase();
    let currentlyFilteredItems =
      lowerCaseInputText.length > 0
        ? items.filter(({ display }) =>
            typeof display === 'string'
              ? display.toLowerCase().includes(lowerCaseInputText)
              : display.searchableText.toLowerCase().includes(lowerCaseInputText)
          )
        : items;
    if (currentlyFilteredItems.length === 0) {
      setState({ ...state, filteredItems: [], activeItemIndex: -1 });
    } else {
      setState({ ...state, filteredItems: currentlyFilteredItems, activeItemIndex: -1 });
    }
  }, [items, state]);

  const onKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;
      if (['ArrowUp', 'ArrowDown', 'Escape', 'Enter'].includes(key)) {
        event.preventDefault();
        return;
      }
      setPopoutOpen(true);
      updateResults();
    },
    [updateResults]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;

      if (key === 'Escape') {
        closeResultsList();
        return;
      }

      if (key === 'ArrowDown' && state.filteredItems.length > 0) {
        setState({
          ...state,
          activeItemIndex:
            state.activeItemIndex < state.filteredItems.length - 1 ? state.activeItemIndex + 1 : 0,
        });
      }

      if (key === 'ArrowUp' && state.filteredItems.length > 0) {
        setState({
          ...state,
          activeItemIndex:
            state.activeItemIndex !== 0
              ? state.activeItemIndex - 1
              : state.filteredItems.length - 1,
        });
      }

      if (key === 'Enter' && state.activeItemIndex > -1) {
        selectItem(state.activeItemIndex);
      }
    },
    [closeResultsList, selectItem, state]
  );

  useEffect(() => {
    document.addEventListener('focusin', checkBlur);
    document.addEventListener('click', checkClick);
    return () => {
      document.removeEventListener('focusin', checkBlur);
      document.removeEventListener('click', checkClick);
    };
  }, [checkBlur, checkClick]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = useCallback(
    throttle(() => {
      setWindowHeight(window.innerHeight);
    }, 64),
    []
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useLayoutEffect(() => {
    if (isPopoutOpen) {
      const {
        bottom: containerBottom,
        top: containerTop,
      } = containerRef.current!.getBoundingClientRect();
      const currentPopoutChildHeight = (popoutRef.current!.children[0] as HTMLElement).offsetHeight;
      const availablePopoutHeightBottom =
        windowHeight - containerBottom - LIST_BOX_OFFSET - theme.rhythms.outside.vertical;
      const availablePopoutHeightTop =
        containerTop - LIST_BOX_OFFSET - theme.rhythms.outside.vertical;
      const availablePopoutHeight = Math.max(availablePopoutHeightBottom, availablePopoutHeightTop);
      setPopoutHeight(
        currentPopoutChildHeight >= availablePopoutHeight ? availablePopoutHeight : -1
      );
      setpopoutVerticalAnchor(
        availablePopoutHeightBottom >= availablePopoutHeightTop ? 'top' : 'bottom'
      );
    }
  }, [isPopoutOpen, windowHeight, state.filteredItems.length]);

  useEffect(() => {
    if (state.activeItemIndex > -1 && isPopoutOpen) {
      const resultsListItemHeight = resultsListItemRef.current!.clientHeight;
      setResultsListItemHeight(resultsListItemHeight);
      if (activeItemIndicatorOffset + resultsListItemHeight > poputHeight / 2)
        popoutRef.current!.scrollTo({
          top: activeItemIndicatorOffset + resultsListItemHeight - poputHeight / 2,
        });
      if (state.activeItemIndex === 0) {
        popoutRef.current!.scrollTo({ top: 0 });
      }
    }
  }, [
    poputHeight,
    resultsListItemHeight,
    state.activeItemIndex,
    isPopoutOpen,
    activeItemIndicatorOffset,
  ]);

  return (
    <ComboBoxContainer ref={containerRef}>
      <div
        // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
        role="combobox"
        aria-expanded={isPopoutOpen}
        aria-owns={ids.popout}
        aria-haspopup="listbox"
      >
        <Input
          type="text"
          aria-autocomplete="list"
          aria-controls={ids.popout}
          aria-activedescendant={
            state.activeItemIndex > -1
              ? `${ids.resultsListItem}-${state.filteredItems[state.activeItemIndex].value}`
              : ''
          }
          value={state.inputText}
          onFocus={() => {
            updateResults();
            setPopoutOpen(true);
          }}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          onChange={(event) =>
            setState({
              ...state,
              inputText: event.target.value,
            })
          }
          id={id}
          autoComplete="off"
          {...otherProps}
        />
      </div>
      {isPopoutOpen && (
        <Popout
          aria-labelledby={labelId}
          role="listbox"
          id={ids.popout}
          height={poputHeight > -1 ? `${poputHeight}px` : 'auto'}
          verticalAnchor={popoutVerticalAnchor}
          ref={popoutRef}
        >
          {state.filteredItems.length > 0 ? (
            <ResultsList
              noOfItems={state.filteredItems.length}
              ref={resultsListRef}
              itemHeight={`${resultsListItemHeight}px`}
              activeItemIndicatorOffset={`${activeItemIndicatorOffset}px`}
            >
              {state.filteredItems.map(({ value, display }, index) => (
                <StyledListItem
                  key={value}
                  id={`${ids.resultsListItem}-${value}`}
                  role="option"
                  aria-selected={state.activeItemIndex === index}
                  isActive={state.activeItemIndex === index}
                  onClick={() => {
                    selectItem(index);
                  }}
                  ref={index === 0 ? resultsListItemRef : undefined}
                >
                  {typeof display === 'string' ? display : display.component}
                </StyledListItem>
              ))}
            </ResultsList>
          ) : (
            <NoResults>{noResultsMessage}</NoResults>
          )}
        </Popout>
      )}
    </ComboBoxContainer>
  );
};
