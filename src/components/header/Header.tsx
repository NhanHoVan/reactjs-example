import React from 'react';
import logo from '../../logo.svg';
import './Header.css';
import Menu from './Menu';

const Header: React.FC = () => {
  return (
    <header className="header">
      {/* <img src={logo} className="header-logo" alt="logo" /> */}
      <Menu />
    </header>
  );
};

export default Header;
