import React, { useContext, useState, useEffect } from 'react'
import { Link } from "gatsby"
import { workId } from '../context'
import { IoArrowForwardOutline } from "react-icons/io5";
import gsap from 'gsap';

import works from '../../data/works.json'

function WorkDescription() {
  const [navActive, setnavActive] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const { idChange } = useContext(workId);

  useEffect(() => {
    let nav = document.querySelector('.navWork');

    nav.addEventListener('mouseenter', () => {
      setnavActive(true);
    })

    nav.addEventListener('mouseleave', () => {
      setnavActive(false);
    })
  }, [])

  useEffect(() => {
    if (currentId !== idChange) {
      const hideText = gsap.timeline({ ease: 'power2.out' });

      hideText.to('.workInfo', {
        duration: .2,
        y: -60,
        scale: 0.95,
        opacity: 0
      })
        .set('.workInfo', {
          duration: .5,
          y: 40,
          scale: 1.05,
          opacity: 0,
          onComplete: () => { setCurrentId(idChange) }
        })
        .to('.workInfo', {
          y: 0,
          scale: 1,
          opacity: 1
        })

    }

  }, [idChange])

  return (
    <>
      <div className="workDescription" style={{ filter: navActive ? 'blur(8px)' : 'blur(0px)', zIndex: navActive ? 1 : 5 }}>
        <div className="workInfo">
          <h1 style={{ color: works[currentId].colorHeader }}>{works[currentId].name}</h1>
          <p style={{ color: works[currentId].colorText }}>{works[currentId].description}</p>
          <Link style={{ color: works[currentId].colorText }} className="workInfo_button" to={works[currentId].slug}> Посмотреть проект <IoArrowForwardOutline style={{ color: works[currentId].colorHeader }} /></Link>
        </div>
        <div className="video">

        </div>
      </div>
    </>
  )
}

export default WorkDescription
