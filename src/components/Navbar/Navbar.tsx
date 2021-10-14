import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'ui/Container';

export const Navbar: React.FC = () => {
  // const match = useRouteMatch();
  // console.log(match.url);
  return (
    <Container>
      {/* <Link to="/">Savages</Link>
      <Link to="/resources/races">Races</Link>
      <Link to="/characters">Characters</Link>
      <Link to="/settings">Settings</Link> */}

      <Link to="/modifiers">Modifiers</Link>
      <Link to="/skills">Skills</Link>
      <Link to="/weapons">Weapons</Link>
      <Link to="/hindrances">Hindrances</Link>
      <Link to="/edges">Edges</Link>
      <Link to="/races">Races</Link>
      <Link to="/settings">Settings</Link>
    </Container>
  );
};
