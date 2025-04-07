import { Space } from "antd";
import Admin_footer from "./Admin_footer";
import Admin_header from "./Admin_header";
import Admin_sidemenu from "./Admin_sidemenu";
import './css/Admin_home.css'
import Admin_exhibition from "./Admin_exihibition";
function Admin_main_exihibition(){
    return(
        <div className="Admin_app">
            <Admin_header />
            <div className="SlidemenuandPagecontent">
                <Admin_sidemenu />
                <Admin_exhibition/>
            </div>
            <Admin_footer />
        </div>
    );
}
export default Admin_main_exihibition;