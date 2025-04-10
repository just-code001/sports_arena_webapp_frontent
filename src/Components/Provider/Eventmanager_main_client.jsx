import './css/Eventmanager_home.css'
import Eventmanager_header from "./Eventmanager_header";
import Eventmanager_sidemenu from "./Eventmanager_sidemenu";
import Eventmanager_footer from "./Eventmanager_footer";
import Eventmanger_client from './Eventmanager_client';
function Eventmanager_main_client(){
    return(
        <div className="Eventmanager_app">
            <Eventmanager_header/>
            <div className="EMSlidemenuandPagecontent">
                <Eventmanager_sidemenu/>
                <Eventmanger_client/>
            </div>
            <Eventmanager_footer/>
        </div>
    );
}
export default Eventmanager_main_client;