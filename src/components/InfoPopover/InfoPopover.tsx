import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Popover } from 'ui/Popover';

const StyledInfoPopover = styled.button`
  height: 24px;
  width: 24px;
  border-radius: 100%;
  vertical-align: middle;
  background: none;
  padding: 0;
  position: relative;

  & > * {
    position: absolute;
    left: 50%;
    top: 50%;
    line-height: 1;
    transform: translate(-50%, -50%);
  }
`;

interface InfoPopoverProps {
  content: string | React.ReactNode;
  title: string;
}

export const InfoPopover: React.FC<InfoPopoverProps> = observer(
  ({ content, title, ...otherProps }) => {
    return (
      <Popover content={content}>
        <StyledInfoPopover title={title} {...otherProps}>
          <span>?</span>
        </StyledInfoPopover>
      </Popover>
    );
  }
);
