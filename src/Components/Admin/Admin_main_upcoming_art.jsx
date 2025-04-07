import { Space } from "antd";
import Admin_footer from "./Admin_footer";
import Admin_header from "./Admin_header";
import Admin_sidemenu from "./Admin_sidemenu";
import './css/Admin_home.css'
import Admin_upcoming_art from "./Admin_upcoming_art";
import Admin_upcomingcars from "./Admin_upcomingcars";
function Admin_main_upcoming_art(){
    return(
        <div className="Admin_app">
            <Admin_header />
            <div className="SlidemenuandPagecontent">
                <Admin_sidemenu />
                <Admin_upcoming_art/>
                {/* <Admin_upcomingcars/> */}
            </div>
            <Admin_footer />
        </div>
    );
}
export default Admin_main_upcoming_art;