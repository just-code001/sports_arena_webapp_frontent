import "./css/Provider_home.css"
import Provider_header from "./Provider_header"
import Provider_sidemenu from "./Provider_sidemenu"
import Provider_footer from "./Provider_footer"
import Provider_dashboard from "./Provider_dashboard"

function Provider_home() {
  return (
    <div className="Eventmanager_app">
      <Provider_header />
      <div className="EMSlidemenuandPagecontent">
        <Provider_sidemenu />
        <div className="Eventmanager_pagecontent">
          <Provider_dashboard/>
        </div>
      </div>
      <Provider_footer />
    </div>
  )
}

export default Provider_home
