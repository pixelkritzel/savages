import * as React from 'react';
import { observer } from 'mobx-react';

import { Navbar } from 'components/Navbar';
import { Router } from 'components/Router';
import { StoreContext } from 'components/StoreContext';

import { Container } from 'ui/Container';
import styled from 'styled-components';

const StyledLayout = styled.div`
  padding-top: ${({ theme }) => theme.rhythms.outside.vertical};
`;

@observer
export class Layout extends React.Component {
  static contextType = StoreContext;
  // @ts-expect-error
  context!: React.ContextType<typeof StoreContext>;

  render() {
    return (
      <>
        <Navbar />
        <Container>
          <StyledLayout>
            <Router />
          </StyledLayout>
        </Container>
      </>
    );
  }
}
