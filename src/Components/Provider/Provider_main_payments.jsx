import React from 'react'
import Provider_header from './Provider_header'
import Provider_sidemenu from './Provider_sidemenu'
import Provider_footer from './Provider_footer'
import Provider_payments from './Provider_payments'

const Provider_main_payments = () => {
  return (
    <div className="Eventmanager_app">
            <Provider_header/>
            <div className="EMSlidemenuandPagecontent">
                <Provider_sidemenu/>
                <Provider_payments/>
            </div>
            <Provider_footer/>
        </div>
  )
}

export default Provider_main_payments
