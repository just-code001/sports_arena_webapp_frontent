import { AppstoreAddOutlined, CommentOutlined, DollarCircleOutlined, EnvironmentOutlined, HeartOutlined, UserOutlined, UsergroupAddOutlined, LogoutOutlined, CarOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
function Admin_sidemenu(){

const location=useLocation();
const[selectedKeys,setselectedkeys] = useState('/')

    useEffect(()=>{
        const pathName=location.pathname
        setselectedkeys(pathName)

    },[location.pathname])

    const navigate=useNavigate()
    return( 
        <div className="Admin_sidemenu">
           <Menu 
           className="Admin_sidemenu_vertical"
           mode="vertical"
           onClick={(item)=>{
            if (item.key === "/") {
                sessionStorage.clear();
                navigate("/");
              } else {
                navigate(item.key);
              }
           }}
           selectedKeys={[selectedKeys]}
           items={[
            {
                label:"Dashboard",
                icon:<AppstoreAddOutlined/>,
                key:"/admin/dashboard",
            },
            {
                label:"User",
                key:"/Admin/user",
                icon:<UserOutlined/>,
            },
            {
                label:"Client",
                key:"/admin/all-clients",
                icon:<UsergroupAddOutlined/>,
            },
            {
                label:"Sport Category",
                key:"/admin/sport-category",
                icon:<DollarCircleOutlined/>,
            },
            {
                label:"upcoming art",
                key:"/Admin/upcomingart",
                icon:<DollarCircleOutlined/>,
            },
            {
                label:"Events",
                key:"/Admin/event",
                icon:<HeartOutlined/>,
            },
            {
                label:"Venue",
                key:"/Admin/venue",
                icon:<EnvironmentOutlined/>,
            },
            {
                label:"Booked Venue",
                key:"/Admin/bookedvenue",
                icon:<DollarCircleOutlined/>,
            },
            // {
            //     label:"Review",
            //     key:"/Admin/review",
            //     icon:<CommentOutlined/>
            // },
            {
                label:"Special Service",
                key:"/Admin/special-service",
                icon:<HeartOutlined />
            },
            {
                label:"upcoming cars",
                key:"/Admin/upcomingcars",
                icon:<CarOutlined />
            },
            {
                label: "Log Out",
                key: "/",
                icon: <LogoutOutlined />
              },
            
           ]}>

           </Menu>

        </div>
    );
}
export default Admin_sidemenu;