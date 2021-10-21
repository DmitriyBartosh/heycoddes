import React, { useContext } from 'react'

import { workId } from '../context'
import works from '../../data/works.json'

import WorkDescription from './description'
import WorksList from './canvas'
import Nav from './nav'

function WorkContainer() {
  const { idChange } = useContext(workId);

  return (
    <section className="previewContainer" style={{ backgroundColor: works[idChange].color }}>
      <WorkDescription />
      <WorksList />
      <Nav />
    </section>
  )
}

export default WorkContainer
