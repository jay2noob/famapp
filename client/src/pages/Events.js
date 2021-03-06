import React, { Fragment } from 'react'
import SideNavbar from '../components/SideNavbar'
import Navbar from '../components/Navbar'
import EventsContainer from '../components/Event/index'

 function Events() {
  return (
    <Fragment>
      <SideNavbar />
      <Navbar />
      <EventsContainer />
    </Fragment>
  )
}

export default Events;