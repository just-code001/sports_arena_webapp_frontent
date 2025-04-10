import React from 'react'
import Provider_header from './Provider_header';
import Provider_sidemenu from './Provider_sidemenu';
import Provider_venueslot from './Provider_venueslot';
import Provider_footer from './Provider_footer';

const Provider_main_venueslot = () => {
    return(
        <div className="Eventmanager_app">
            <Provider_header/>
            <div className="EMSlidemenuandPagecontent">
                <Provider_sidemenu/>
                <Provider_venueslot/>
            </div>
            <Provider_footer/>
        </div>
    );
}

export default Provider_main_venueslot
