import React from 'react'
import Provider_header from './Provider_header'
import Provider_sidemenu from './Provider_sidemenu'
import Provider_footer from './Provider_footer'
import Provider_all_bookings from './Provider_all_bookings'

const Provider_main_all_bookings = () => {
  return (
    <div className="Eventmanager_app">
            <Provider_header/>
            <div className="EMSlidemenuandPagecontent">
                <Provider_sidemenu/>
                <Provider_all_bookings/>
            </div>
            <Provider_footer/>
        </div>
  )
}

export default Provider_main_all_bookings
