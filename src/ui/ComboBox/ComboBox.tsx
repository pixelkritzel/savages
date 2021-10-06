import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';

import { Input } from 'ui/Input';

import { generateId } from 'lib/utils/generateId';
import styled from 'styled-components';

const StyledListItem = styled.li<{ isActive: boolean }>`
  border: ${({ isActive }) => isActive && '1px solid cornflowerblue'};
  cursor: default;

  &:hover {
    background-color: lightblue;
  }
`;

interface ComboBoxProps {
  items: {
    value: string;
    display: string | { component: React.ReactNode; searchableText: string };
  }[];
  label: string | React.ReactNode;
  onHide?: () => void;
  onValueChange?: (value: string, index: number) => void;
}

export const ComboBox = observer(function ComboBoxFn({
  items,
  label,
  onHide,
  onValueChange,
  ...otherProps
}: ComboBoxProps) {
  const [inputText, setInputText] = useState('');
  const [filteredItems, setFilteredItems] = useState<ComboBoxProps['items']>([]);
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const ids = useMemo(
    () => ({
      input: generateId('input'),
      label: generateId('label'),
      listbox: generateId('listbox'),
      listitem: generateId('listitem'),
    }),
    []
  );

  const closeListBox = useCallback(() => {
    setFilteredItems([]);
    setInputText('');
    setActiveItemIndex(-1);
    onHide && onHide();
  }, [onHide]);

  const comboBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkHide = useMemo(
    () => (event: MouseEvent) => {
      if (
        event.target === inputRef.current ||
        comboBoxRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      closeListBox();
    },
    [closeListBox]
  );

  const selectItem = useCallback(
    (index) => {
      const { display, value: selectedValue } = filteredItems[index];
      setInputText(typeof display === 'string' ? display : display.searchableText);
      setFilteredItems([]);
      if (onValueChange) {
        const originalIndex = items.findIndex(
          ({ value: itemValue }) => itemValue === selectedValue
        );
        onValueChange(selectedValue, originalIndex);
      }
    },
    [filteredItems, items, onValueChange]
  );

  const updateResults = useCallback(() => {
    const lowerCaseInputText = inputText.toLowerCase();
    const currentlyFilteredItems =
      lowerCaseInputText.length > 0
        ? items.filter(({ display }) =>
            typeof display === 'string'
              ? display.toLowerCase().includes(lowerCaseInputText)
              : display.searchableText.toLowerCase().includes(lowerCaseInputText)
          )
        : [];
    if (currentlyFilteredItems.length === 0) {
      closeListBox();
    } else {
      setFilteredItems(currentlyFilteredItems);
      setActiveItemIndex(-1);
    }
  }, [closeListBox, inputText, items]);

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

      if (key === 'ArrowDown' && filteredItems.length > 0) {
        setActiveItemIndex(activeItemIndex < filteredItems.length - 1 ? activeItemIndex + 1 : 0);
      }

      if (key === 'ArrowUp' && filteredItems.length > 0) {
        setActiveItemIndex(activeItemIndex !== 0 ? activeItemIndex - 1 : filteredItems.length - 1);
      }

      if (key === 'Enter' && activeItemIndex > -1) {
        selectItem(activeItemIndex);
      }
    },
    [activeItemIndex, closeListBox, filteredItems.length, selectItem]
  );

  useEffect(() => {
    document.addEventListener('click', checkHide);
    return () => {
      document.removeEventListener('click', checkHide);
    };
  }, [checkHide]);

  const isListBoxShown = useMemo(() => Boolean(filteredItems.length), [filteredItems]);

  return (
    <>
      <label id={ids.label} htmlFor={ids.input} className="combobox-label">
        {label}
      </label>
      <div className="combobox-wrapper">
        <div
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
          role="combobox"
          aria-expanded={isListBoxShown}
          aria-owns={ids.listbox}
          aria-haspopup="listbox"
          id="ex2-combobox"
          ref={comboBoxRef}
        >
          <Input
            type="text"
            aria-autocomplete="list"
            aria-controls={ids.listbox}
            aria-labelledby={ids.label}
            aria-activedescendant={
              activeItemIndex > -1 ? `${ids.listitem}-${filteredItems[activeItemIndex].value}` : ''
            }
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
            onBlur={closeListBox}
            id={ids.input}
            ref={inputRef}
          />
        </div>
        <ul aria-labelledby={ids.label} role="listbox" id={ids.listbox} className="listbox hidden">
          {isListBoxShown &&
            filteredItems.map(({ value, display }, index) => (
              <StyledListItem
                key={value}
                id={`${ids.listitem}-${value}`}
                role="option"
                aria-selected={activeItemIndex === index}
                isActive={activeItemIndex === index}
                onClick={() => selectItem(index)}
              >
                {typeof display === 'string' ? display : display.component}
              </StyledListItem>
            ))}
        </ul>
      </div>
    </>
  );
});
