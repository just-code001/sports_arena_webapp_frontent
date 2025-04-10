import { AppstoreAddOutlined, CommentOutlined, DollarCircleOutlined, EnvironmentOutlined, HeartOutlined, PayCircleFilled, PayCircleOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Provider_sidemenu = () => {
    const location=useLocation();
    const[selectedKeys,setselectedkeys] = useState('/')
    
        useEffect(()=>{
            const pathName=location.pathname
            setselectedkeys(pathName)
    
        },[location.pathname])
    
        const handleLogout = () => {
            // Remove user data from local storage
            localStorage.removeItem('manager-info');
            // Redirect to the login page or any other appropriate route
            navigate('/');
          };
    
        const navigate=useNavigate()
        return( 
            <div className="eventmanager_sidemenu">
               <Menu 
               className="eventmanager_sidemenu_vertical"
               mode="vertical"
               onClick={(item)=>{
                if (item.key === '/') {
                    handleLogout(); // Call handleLogout function when logout item is clicked
                  } else {
                    navigate(item.key);
                  }
                }}
               selectedKeys={[selectedKeys]}
               items={[
                {
                    label:"profile",
                    key:"/eventmanager/profile",
                    icon:<UserOutlined/>,
                },
                {
                    label:"Dashboard",
                    icon:<AppstoreAddOutlined/>,
                    key:"/eventmanager",
                },
                {
                    label:"staff",
                    key:"/eventmanager/staff",
                    icon:<UserOutlined/>,
                },
                {
                    label:"Client",
                    key:"/eventmanager/client",
                    icon:<UsergroupAddOutlined/>,
                },
                {
                    label:"Venue Slots",
                    key:"/provider/venues-slots",
                    icon:<HeartOutlined/>,
                },
                {
                    label:"Venue",
                    key:"/provider/venues",
                    icon:<EnvironmentOutlined/>,
                },
                {
                    label:"logout",
                    key:"/",
                    icon:<UserOutlined/>,
                },
                // {
                //     label:"Transaction",
                //     key:"/Admin/transaction",
                //     icon:<DollarCircleOutlined/>,
                // },
                // {
                //     label:"Review",
                //     key:"/Admin/review",
                //     icon:<CommentOutlined/>
                // },
                
               ]}>
    
               </Menu>
    
            </div>
        );
}

export default Provider_sidemenu
