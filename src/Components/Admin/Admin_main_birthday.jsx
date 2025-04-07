import { Space } from "antd";
import Admin_footer from "./Admin_footer";
import Admin_header from "./Admin_header";
import Admin_sidemenu from "./Admin_sidemenu";
import './css/Admin_home.css'
import Admin_birthday_display_package from "./Admin_birthday_display_package";
import Admin_birthday_display_theme from "./Admin_birthday_display_theme";
function Admin_main_birthday(){
    return(
        <div className="Admin_app">
            <Admin_header />
            <div className="SlidemenuandPagecontent">
                <Admin_sidemenu />
                <div className="d-flex flex-column justify-content-center">
                <Admin_birthday_display_package/>
                <Admin_birthday_display_theme/>
                </div>
            </div>
            <Admin_footer />
        </div>
    );
}
export default Admin_main_birthday;