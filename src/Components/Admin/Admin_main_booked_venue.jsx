import Admin_footer from "./Admin_footer";
import Admin_header from "./Admin_header";
import Admin_sidemenu from "./Admin_sidemenu";
import './css/Admin_home.css'
import Admin_booked_venue from "./Admin_booked_venue";
function Admin_main_booked_venue(){
    return(
        <div className="Admin_app">
            <Admin_header />
            <div className="SlidemenuandPagecontent">
                <Admin_sidemenu />
                <Admin_booked_venue/>
            </div>
            <Admin_footer />
        </div>
    );
}
export default Admin_main_booked_venue;