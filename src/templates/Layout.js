import React, { useState } from 'react'
import Header from '../components/global/header'
import { workId } from "../components/context"

import works from '../data/works.json'

import '../styles/main.scss'

function Layout({ children }) {
  const [idChange, setidChange] = useState(0);

  return (
    <workId.Provider value={{ idChange, setidChange }}>
      <main>
        <Header colorText={works[idChange].colorText}/>
        {children}
      </main>
    </workId.Provider>
  )
}

export default Layout
