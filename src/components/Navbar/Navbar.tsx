import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import BSNavbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

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
            <NavDropdown title="Resources" id="basic-nav-dropdown">
              <NavDropdown.Item active={match.url === '/characters'} as="span">
                <Link className={'dropdown-item' /* BS class name */} to="/resources/races">
                  Races
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
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
