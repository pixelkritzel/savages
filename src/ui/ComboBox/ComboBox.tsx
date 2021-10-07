import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Input } from 'ui/Input';

import { generateId } from 'lib/utils/generateId';

const ComboBoxContainer = styled.div`
  position: relative;
`;

const StyledList = styled.ul<{ noOfItems: number; activeIndex: number }>`
  position: absolute;
  display: ${({ noOfItems }) => (noOfItems > 0 ? 'flex' : 'none')};
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.grays[600]};
  width: 100%;
  top: calc(100% + 2px);
  box-shadow: ${({ theme }) => theme.shadows.default};
  overflow-x: hidden;

  &:before {
    content: '';
    position: absolute;
    height: calc(100% / ${({ noOfItems }) => noOfItems});
    width: 6px;
    left: 0px;
    top: calc((100% / ${({ noOfItems }) => noOfItems}) * ${({ activeIndex }) => activeIndex});
    background-color: cornflowerblue;
    transition: top 0.4s ease-in-out;
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

export const ComboBox = observer(function ComboBoxFn({
  id,
  items,
  labelId,
  onHide,
  onValueSelect,
  ...otherProps
}: ComboBoxProps) {
  const [state, setState] = useState(COMBO_BOX_INITIAL_STATE);

  const ids = useMemo(
    () => ({
      listbox: generateId('listbox'),
      listitem: generateId('listitem'),
    }),
    []
  );

  const closeListBox = useCallback(() => {
    setState(COMBO_BOX_INITIAL_STATE);
    onHide && onHide();
  }, [onHide]);

  const containerRef = useRef<HTMLDivElement>(null);

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
        : [];
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

  const isListBoxShown = useMemo(() => Boolean(state.filteredItems.length), [state.filteredItems]);

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
      <StyledList
        aria-labelledby={labelId}
        role="listbox"
        id={ids.listbox}
        noOfItems={state.filteredItems.length}
        activeIndex={state.activeItemIndex}
      >
        {isListBoxShown &&
          state.filteredItems.map(({ value, display }, index) => (
            <StyledListItem
              key={value}
              id={`${ids.listitem}-${value}`}
              role="option"
              aria-selected={state.activeItemIndex === index}
              isActive={state.activeItemIndex === index}
              onMouseUp={() => {
                console.log('Clicked');
                selectItem(index);
              }}
            >
              {typeof display === 'string' ? display : display.component}
            </StyledListItem>
          ))}
      </StyledList>
    </ComboBoxContainer>
  );
});
