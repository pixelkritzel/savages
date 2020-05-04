import * as React from 'react';
import { observer } from 'mobx-react';

import Container from 'react-bootstrap/Container';

import { Navbar } from 'components/Navbar';
import { Router } from 'components/Router';
import { StoreContext } from 'components/StoreContext';

import CSS from './Layout.module.scss';

@observer
export class Layout extends React.Component {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  render() {
    return (
      <>
        <Navbar />
        <Container>
          <div className={CSS.contentPadding}>
            <Router />
          </div>
        </Container>
      </>
    );
  }
}
