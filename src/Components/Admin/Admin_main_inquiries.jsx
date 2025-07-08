import { Space } from "antd";
import Admin_footer from "./Admin_footer";
import Admin_header from "./Admin_header";
import Admin_sidemenu from "./Admin_sidemenu";
import './css/Admin_home.css'
import Admin_inquiries from "./Admin_inquiries";

const Admin_main_inquiries = () => {
  return (
    <div className="Admin_app">
            <Admin_header />
            <div className="SlidemenuandPagecontent">
                <Admin_sidemenu />
                <Admin_inquiries/>
            </div>
            <Admin_footer />
        </div>
  )
}

export default Admin_main_inquiries
