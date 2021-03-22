import React from 'react';
// import ButtonLink from './components/ButtonLink';
import Button from '../Button';
import Logo from '../../assets/img/Logo.png';

import './Navbar.css';

function Navbar() {
  return (
    <nav className='Menu'>
      <a href='/'>
        <img src={Logo} alt='AluraFlix logo' className='Logo' />
      </a>
      <Button as='a' className='ButtonLink' href='/'>
        Novo vídeo
      </Button>
    </nav>
  );
}

export default Navbar;
