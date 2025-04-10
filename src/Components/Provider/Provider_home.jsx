import React from 'react'
import './css/Provider_home.css';
import Provider_header from './Provider_header';
import Provider_sidemenu from './Provider_sidemenu';
import Provider_pagecontent from './Provider_pagecontent';
import Provider_footer from './Provider_footer';

const Provider_home = () => {
    return (
        <div className="Eventmanager_app">
            <Provider_header/>
            <div className="EMSlidemenuandPagecontent">
                <Provider_sidemenu/>
                <Provider_pagecontent/>
            </div>
            <Provider_footer/>
        </div>
    );
}

export default Provider_home
