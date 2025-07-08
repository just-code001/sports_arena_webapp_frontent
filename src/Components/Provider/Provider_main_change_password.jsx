import React from 'react'
import Provider_change_password from './Provider_change_password'
import Provider_header from './Provider_header'
import Provider_sidemenu from './Provider_sidemenu'
import Provider_footer from './Provider_footer'

const Provider_main_change_password = () => {
  return (
    <div className="Eventmanager_app">
            <Provider_header/>
            <div className="EMSlidemenuandPagecontent">
                <Provider_sidemenu/>
                <Provider_change_password/>
            </div>
            <Provider_footer/>
        </div>
  )
}

export default Provider_main_change_password
