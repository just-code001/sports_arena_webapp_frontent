import './css/Eventmanager_home.css'
import Eventmanager_header from "./Eventmanager_header";
import Eventmanager_sidemenu from "./Eventmanager_sidemenu";
import Eventmanager_footer from "./Eventmanager_footer";
import Eventmanager_profile from './Eventmanager_profile';
function Eventmanager_main_profile(){
    return(
        <div className="Eventmanager_app">
            <Eventmanager_header/>
            <div className="EMSlidemenuandPagecontent">
                <Eventmanager_sidemenu/>
                <Eventmanager_profile/>
            </div>
            <Eventmanager_footer/>
        </div>
    );
}
export default Eventmanager_main_profile;