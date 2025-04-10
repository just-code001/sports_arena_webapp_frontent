import { Space } from "antd";
import './css/Eventmanager_home.css'
import Eventmanager_header from "./Eventmanager_header";
import Eventmanager_sidemenu from "./Eventmanager_sidemenu";
import Eventmanager_footer from "./Eventmanager_footer";
import Eventmanager_staff from "./Eventmanager_staff";
function Eventmanager_staff_main(){
    return(
        <div className="Eventmanager_app">
            <Eventmanager_header/>
            <div className="EMSlidemenuandPagecontent">
                <Eventmanager_sidemenu/>
                <Eventmanager_staff/>
            </div>
            <Eventmanager_footer/>
        </div>
    );
}
export default Eventmanager_staff_main;