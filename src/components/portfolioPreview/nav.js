import React, { useContext, useEffect } from 'react'
import { workId } from '../context'
import gsap from 'gsap';

import works from '../../data/works.json'

function Nav() {
  const { idChange } = useContext(workId);


  useEffect(() => {
    let nav = document.querySelector('.navWork');

    nav.addEventListener('mouseenter', () => {
      gsap.to('.nameWork p', {
        x: 0,
        opacity: 1,
        stagger: 0.1
      })
    })

    nav.addEventListener('mouseleave', () => {
      gsap.to('.nameWork p', {
        x: 6,
        opacity: 0,
        stagger: 0.1
      })
    })
  }, [])

  return (
    <div className="navContainer">
      <nav className="navWork" id="rightNavigation">
        {works.map((work, i) => {
          return (
            <div className={idChange === i ? 'nameWork active' : 'nameWork'} data-nav={i} key={i}>
              <div className="mark" style={{ backgroundColor: works[idChange].colorHeader }} />
              <p style={{ color: works[idChange].colorText, transform: 'translate(6px, 0px)', opacity: 0 }}>{work.name}</p>
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default Nav
