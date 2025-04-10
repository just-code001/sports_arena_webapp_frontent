import React from 'react'
import Provider_header from './Provider_header';
import Provider_sidemenu from './Provider_sidemenu';
import Provider_venue from './Provider_venue';
import Provider_footer from './Provider_footer';

const Provider_main_venue = () => {
    return(
        <div className="Eventmanager_app">
            <Provider_header/>
            <div className="EMSlidemenuandPagecontent">
                <Provider_sidemenu/>
                <Provider_venue/>
            </div>
            <Provider_footer/>
        </div>
    );
}

export default Provider_main_venue
