import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'ui/Container';

export const Navbar: React.FC = () => {
  // const match = useRouteMatch();
  // console.log(match.url);
  return (
    <Container>
      <Link to="/">Savages</Link>

      <Link to="/characters">Characters</Link>

      <Link to="/settings">Settings</Link>

      <Link to="/resources/races">Races</Link>
    </Container>
  );
};
