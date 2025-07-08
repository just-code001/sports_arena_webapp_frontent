import { AppstoreAddOutlined, CommentOutlined, DollarCircleOutlined, EnvironmentOutlined, HeartOutlined, PayCircleFilled, PayCircleOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Auth/context/AuthContext";

const Provider_sidemenu = () => {
    const location = useLocation();
    const [selectedKeys, setselectedkeys] = useState('/')
    const { isAuthenticated, userRole, logout } = useContext(AuthContext);

    useEffect(() => {
        const pathName = location.pathname
        setselectedkeys(pathName)

    }, [location.pathname])

    const handleLogout = () => {
        // Remove user data from local storage
        logout();
        // Redirect to the login page or any other appropriate route
        navigate('/');
    };

    const navigate = useNavigate()
    return (
        <div className="eventmanager_sidemenu">
            <Menu
                className="eventmanager_sidemenu_vertical"
                mode="vertical"
                onClick={(item) => {
                    if (item.key === '/') {
                        handleLogout(); // Call handleLogout function when logout item is clicked
                    } else {
                        navigate(item.key);
                    }
                }}
                selectedKeys={[selectedKeys]}
                items={[
                    {
                        label: "Dashboard",
                        icon: <AppstoreAddOutlined />,
                        key: "/provider/dashboard",
                    },
                    {
                        label: "Venue",
                        key: "/provider/venues",
                        icon: <EnvironmentOutlined />,
                    },
                    {
                        label: "Venue Slots",
                        key: "/provider/venues-slots",
                        icon: <HeartOutlined />,
                    },
                    {
                        label: "Venue Reviews",
                        key: "/provider/venues-reviews",
                        icon: <HeartOutlined />,
                    },
                    {
                        label: "All Bookings",
                        key: "/provider/all-booking",
                        icon: <UserOutlined />,
                    },
                    {
                        label: "Payments",
                        key: "/provider/payments",
                        icon: <UserOutlined />,
                    },
                    {
                        label: "Change Password",
                        key: "/provider/change-password",
                        icon: <UsergroupAddOutlined />,
                    },
                    {
                        label: "logout",
                        key: "/",
                        icon: <UserOutlined />,
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
