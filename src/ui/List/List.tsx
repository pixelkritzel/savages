import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const UL = styled.ul`
  list-style: none;
  padding: 0;
`;

interface ListProps {
  listItems: React.ReactNode[];
}

export const List = observer(function ListFn({ listItems, ...otherProps }: ListProps) {
  return (
    <UL {...otherProps}>
      {listItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </UL>
  );
});
