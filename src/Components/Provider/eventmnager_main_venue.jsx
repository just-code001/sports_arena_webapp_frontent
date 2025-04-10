import './css/Eventmanager_home.css'
import Eventmanager_header from "./Eventmanager_header";
import Eventmanager_sidemenu from "./Eventmanager_sidemenu";
import Eventmanager_footer from "./Eventmanager_footer";
import Eventmanager_venue from './Eventmanager_venue';

function Eventmanager_main_venue(){
    return(
        <div className="Eventmanager_app">
            <Eventmanager_header/>
            <div className="EMSlidemenuandPagecontent">
                <Eventmanager_sidemenu/>
                <Eventmanager_venue/>
            </div>
            <Eventmanager_footer/>
        </div>
    );
}
export default Eventmanager_main_venue;