import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';

import { Input } from 'ui/Input';

import { generateId } from 'lib/utils/generateId';
import { theme } from 'components/ThemeProvider/theme';

const ComboBoxContainer = styled.div`
  position: relative;
`;

const StyledList = styled.ul<{
  noOfItems: number;
  activeIndex: number;
  height?: string;
  itemHeight: string;
  activeItemIndicatorOffset: string;
}>`
  position: absolute;
  display: ${({ noOfItems }) => (noOfItems > 0 ? 'flex' : 'none')};
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.grays[600]};
  width: 100%;
  height: ${({ height = 'auto' }) => height};
  top: calc(100% + 2px);
  box-shadow: ${({ theme }) => theme.shadows.default};
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: ${({ theme }) => theme.colors.backgrounds.default};

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
export type ComboBoxProps = Omit<JSX.IntrinsicElements['input'], 'ref'> & {
  items: {
    value: string;
    display: string | { component: React.ReactNode; searchableText: string };
  }[];
  labelId: string;
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
  onHide,
  onValueSelect,
  ...otherProps
}: ComboBoxProps) {
  const [state, setState] = useState(COMBO_BOX_INITIAL_STATE);
  const [resultsListHeight, setResultsListHeight] = useState<number>(-1);
  const [resultsListItemHeight, setResultsListItemHeight] = useState<number>(-1);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isListBoxShown, setIsListBoxShown] = useState(false);

  const activeItemIndicatorOffset = useMemo(() => state.activeItemIndex * resultsListItemHeight, [
    resultsListItemHeight,
    state.activeItemIndex,
  ]);

  const ids = useMemo(
    () => ({
      listbox: generateId('listbox'),
      listitem: generateId('listitem'),
    }),
    []
  );

  const closeListBox = useCallback(() => {
    setState(COMBO_BOX_INITIAL_STATE);
    setIsListBoxShown(false);
    onHide && onHide();
  }, [onHide]);

  const containerRef = useRef<HTMLDivElement>(null);
  const resultsListRef = useRef<HTMLUListElement>(null);
  const resultsListItemRef = useRef<HTMLLIElement>(null);

  const checkBlur = useMemo(
    () => (event: FocusEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeListBox();
      }
    },
    [closeListBox]
  );

  const checkClick = useMemo(
    () => (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeListBox();
      }
    },
    [closeListBox]
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
      updateResults();
    },
    [updateResults]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;

      if (key === 'Escape') {
        closeListBox();
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
    [closeListBox, selectItem, state]
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
    if (isListBoxShown && state.filteredItems.length > 0) {
      const { bottom: containerBottom } = containerRef.current!.getBoundingClientRect();
      const currentResultsListHeight = resultsListRef.current!.offsetHeight;
      const availableResultsListHeight =
        windowHeight - containerBottom - theme.rhythms.outside.vertical;
      setResultsListHeight(
        currentResultsListHeight >= availableResultsListHeight ? availableResultsListHeight : -1
      );
      console.log(windowHeight, currentResultsListHeight, availableResultsListHeight);
      const resultsListItemHeight = resultsListItemRef.current!.clientHeight;
      setResultsListItemHeight(resultsListItemHeight);
    }
  }, [isListBoxShown, windowHeight, state.filteredItems.length]);

  useEffect(() => {
    if (state.activeItemIndex > -1 && isListBoxShown) {
      if (activeItemIndicatorOffset + resultsListItemHeight > resultsListHeight / 2)
        resultsListRef.current!.scrollTo({
          top: activeItemIndicatorOffset + resultsListItemHeight - resultsListHeight / 2,
        });
      if (state.activeItemIndex === 0) {
        resultsListRef.current!.scrollTo({ top: 0 });
      }
    }
  }, [
    resultsListHeight,
    resultsListItemHeight,
    state.activeItemIndex,
    isListBoxShown,
    activeItemIndicatorOffset,
  ]);

  return (
    <ComboBoxContainer ref={containerRef}>
      <div
        // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
        role="combobox"
        aria-expanded={isListBoxShown}
        aria-owns={ids.listbox}
        aria-haspopup="listbox"
      >
        <Input
          type="text"
          aria-autocomplete="list"
          aria-controls={ids.listbox}
          aria-activedescendant={
            state.activeItemIndex > -1
              ? `${ids.listitem}-${state.filteredItems[state.activeItemIndex].value}`
              : ''
          }
          value={state.inputText}
          onFocus={() => {
            updateResults();
            setIsListBoxShown(true);
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
      {isListBoxShown &&
        (state.filteredItems.length > 0 ? (
          <StyledList
            aria-labelledby={labelId}
            role="listbox"
            id={ids.listbox}
            noOfItems={state.filteredItems.length}
            activeIndex={state.activeItemIndex}
            ref={resultsListRef}
            height={resultsListHeight > -1 ? `${resultsListHeight}px` : 'auto'}
            itemHeight={`${resultsListItemHeight}px`}
            activeItemIndicatorOffset={`${activeItemIndicatorOffset}px`}
          >
            {state.filteredItems.map(({ value, display }, index) => (
              <StyledListItem
                key={value}
                id={`${ids.listitem}-${value}`}
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
          </StyledList>
        ) : (
          <div>No results</div>
        ))}
    </ComboBoxContainer>
  );
};
