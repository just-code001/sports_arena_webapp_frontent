import { Space } from "antd";
import './css/Admin_home.css';
import Admin_header from "./Admin_header";
import Admin_sidemenu from "./Admin_sidemenu";
import Admin_pagecontent from "./Admin_pagecontent";
import Admin_footer from "./Admin_footer";
import PaymentPage from "./PaymentPage";

function Admin_home() {
    return (
        <div className="Admin_app">
            <Admin_header />
            <div className="SlidemenuandPagecontent">
                <Admin_sidemenu />
                <Admin_pagecontent />
            </div>
            <Admin_footer />
        </div>
    );
}
export default Admin_home;