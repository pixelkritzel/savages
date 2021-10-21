import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'ui/Container';

export const Navbar: React.FC = () => {
  return (
    <Container>
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
