import { Space } from "antd";
import Admin_footer from "./Admin_footer";
import Admin_header from "./Admin_header";
import Admin_sidemenu from "./Admin_sidemenu";
import './css/Admin_home.css'
import Admin_providers from "./Admin_providers";
const Admin_main_providers=()=>{
    return(
        <div className="Admin_app">
            <Admin_header />
            <div className="SlidemenuandPagecontent">
                <Admin_sidemenu />
                <Admin_providers/>
            </div>
            <Admin_footer />
        </div>
    );
}
export default Admin_main_providers;