import React from 'react'

import Logo from './logo'

function Header({ colorText }) {
  return (
    <header className="header">
      <a href="/" className="header__logo">
        <Logo color={colorText} />
      </a>
      <a href="/contact" className="header__contact" style={{ color: colorText }}>Контакты</a>
    </header>
  )
}

export default Header
