import React from 'react'
import Admin_footer from "./Admin_footer";
import Admin_header from "./Admin_header";
import Admin_sidemenu from "./Admin_sidemenu";
import './css/Admin_home.css'
import Admin_sportcategories from './Admin_sportcategories';

const Admin_main_sport_category = () => {
    return(
        <div className="Admin_app">
            <Admin_header />
            <div className="SlidemenuandPagecontent">
                <Admin_sidemenu />
                <Admin_sportcategories/>
            </div>
            <Admin_footer />
        </div>
    );
}

export default Admin_main_sport_category
