import { Space } from "antd";
import Admin_footer from "./Admin_footer";
import Admin_header from "./Admin_header";
import Admin_sidemenu from "./Admin_sidemenu";
import './css/Admin_home.css'
import Admin_special_service from "./Admin_special_service";
function Admin_main_special_service(){
    return(
        <div className="Admin_app">
            <Admin_header />
            <div className="SlidemenuandPagecontent">
                <Admin_sidemenu />
                <Admin_special_service/>
            </div>
            <Admin_footer />
        </div>
    );
}
export default Admin_main_special_service;