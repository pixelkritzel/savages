import React from 'react';
import styled from 'styled-components';

const HTMLContainer = styled.div``;

interface HtmlProps extends React.ComponentPropsWithoutRef<typeof HTMLContainer> {
  html: string;
}

export const Html = function HtmlFn({ html, ...otherProps }: HtmlProps) {
  return <HTMLContainer dangerouslySetInnerHTML={{ __html: html }} {...otherProps} />;
};
