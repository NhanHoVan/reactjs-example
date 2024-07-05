import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu: React.FC = () => {
  return (
    <nav className="menu">
      <ul>
        <li><Link to="/">PDF</Link></li>
        <li><Link to="/example-template-2">Example 2</Link></li>
        <li><Link to="/example-template-3">Example 3</Link></li>
      </ul>
    </nav>
  );
};

export default Menu;
