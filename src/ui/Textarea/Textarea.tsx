import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { focusStyles } from 'lib/utils/focus-styles';
import { useState } from 'react';

const StyledTextarea = styled.textarea<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.input.padding.default};
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.input.borderColor.error : theme.input.borderColor.normal};
  border-radius: 4px;
  background-color: white;
  resize: none;

  &:focus {
    outline: none;
  }
`;

const TextareaContainer = styled.div<{ hasFocus: boolean }>`
  ${({ hasFocus }) => hasFocus && focusStyles}
`;

interface TextareaProps extends React.ComponentProps<typeof StyledTextarea> {
  className?: string;
  style?: React.CSSProperties;
  onValueChange?: (value: string) => void;
}

export const Textarea = observer(function TextareaFn({
  className,
  style,
  onValueChange,
  ...otherProps
}: TextareaProps) {
  const [hasFocus, setHasFocus] = useState(false);

  const onBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setHasFocus(false);
    otherProps.onBlur && otherProps.onBlur(event);
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    otherProps.onValueChange && otherProps.onValueChange(event.target.value);
    otherProps.onChange && otherProps.onChange(event);
  };

  const onFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setHasFocus(true);
    otherProps.onFocus && otherProps.onFocus(event);
  };

  return (
    <TextareaContainer hasFocus={hasFocus} className={className} style={style}>
      <StyledTextarea res onBlur={onBlur} onChange={onChange} onFocus={onFocus} {...otherProps} />
    </TextareaContainer>
  );
});
