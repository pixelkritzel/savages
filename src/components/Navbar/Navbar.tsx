import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import BSNavbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';

export const Navbar: React.FC = () => {
  const match = useRouteMatch();
  console.log(match.url);
  return (
    <BSNavbar bg="dark" variant="dark" expand="md">
      <Container>
        <BSNavbar.Brand as="span">
          <Link className={'navbar-brand' /* BS class name */} to="/">
            Savages
          </Link>
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link active={match.url === '/characters'} as="span">
              <Link className={'nav-link' /* BS class name */} to="/characters">
                Characters
              </Link>
            </Nav.Link>
            <Nav.Link active={match.url === '/settings'} as="span">
              <Link className={'nav-link' /* BS class name */} to="/settings">
                Settings
              </Link>
            </Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button>Search</Button>
          </Form>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};
