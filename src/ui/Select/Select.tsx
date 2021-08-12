import styled from 'styled-components';

import { Button, buttonStyles } from 'ui/Button';

const StyledSelect = styled.select`
  ${buttonStyles}
`;

export interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  options: { label: string; value: string }[];
}

export function Select({
  onValueChange = () => undefined,
  options,
  value,
  ...otherProps
}: SelectProps) {
  return (
    <div>
      <StyledSelect value={value} onChange={(event) => onValueChange(event.target.value)}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </StyledSelect>
      <div>{}</div>
    </div>
  );
}
