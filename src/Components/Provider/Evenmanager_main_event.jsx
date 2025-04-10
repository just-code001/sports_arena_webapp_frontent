import './css/Eventmanager_home.css'
import Eventmanager_header from "./Eventmanager_header";
import Eventmanager_sidemenu from "./Eventmanager_sidemenu";
import Eventmanager_footer from "./Eventmanager_footer";
import Eventmanager_event from './Eventmanager_event';

function Eventmanager_main_event(){
    return(
        <div className="Eventmanager_app">
            <Eventmanager_header/>
            <div className="EMSlidemenuandPagecontent">
                <Eventmanager_sidemenu/>
                <Eventmanager_event/>
            </div>
            <Eventmanager_footer/>
        </div>
    );
}
export default Eventmanager_main_event;