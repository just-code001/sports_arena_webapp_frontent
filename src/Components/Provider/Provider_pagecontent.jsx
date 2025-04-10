import { DollarCircleOutlined, HeartOutlined, ShopOutlined, ShoppingCartOutlined, TeamOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { First } from "react-bootstrap/esm/PageItem";
// import { getCustomer, getInventory, getUser, getRevenue } from "../../API/Api_index";
// import { Space, Table, Typography } from "antd";
// import { useEffect, useState } from "react";
// import { getClient ,getStaff} from "../../API/Api_index";

const Provider_pagecontent = () => {
  const [orders,setOrders]=useState(0);
      const [inventory,setInventory]=useState(0);
      const [customers,setCustomers]=useState(0);
      const [revenue,setRevenue]=useState(0);
  
    //   useEffect(()=>{
    //       getUser().then(res=>{
    //           setOrders(res.total);
    //           setRevenue(res.discountedTotal)
    //       });
    //       getInventory().then(res=>{
    //           setInventory(res.total);
    //       });
    //       getCustomer().then(res=>{
    //           setCustomers(res.total);
    //       });
          
    //   },[])
  
  
      const [client, setClient] = useState([]);
      const [staff, setStaff] = useState([]);
  
    //   const fetchClientData = async () => {
    //       try {
    //           const resu = await getClient();
    //           setClient(resu.client);
    //           console.log(resu.client)
  
    //           const res = await getStaff();
    //           setStaff(res.users);
    //           console.log(res.users)
    //       } catch (error) {
    //           console.error('Error fetching order:', error);
    //           // Handle the error gracefully, e.g., show a message to the user
    //       }
    //   };
    //   useEffect(() => {
      
    //       fetchClientData();
          
    //   }, []);
  
      const countClients = () => client.length;
      const countStaff=()=>staff.length;
  
  
  
      return (
          <div className="Eventmanager_pagecontent">
              <Space size={12} direction="vertical">
              <Typography.Title level={3}>Dashboard</Typography.Title>
              <Space direction="horizontal">
                  <DashboardCard
                      icon={<UserOutlined
                          style={{
                              color: "green",
                              backgroundColor: "rgba(0,255,0,0.25)",
                              borderRadius: "20px",
                              fontSize: "24px",
                              padding: "8px"
                          }} />}
                      title={"Clients"}
                      value={countClients()} />
                  {/* <DashboardCard
                      icon={<ShopOutlined
                          style={{
                              color: "blue",
                              backgroundColor: "rgba(0,0,255,0.25)",
                              borderRadius: "20px",
                              fontSize: "24px",
                              padding: "8px"
                          }} />}
                      title={"Inventory"}
                      value={inventory} /> */}
                  <DashboardCard
                      icon={<TeamOutlined
                          style={{
                              color: "purple",
                              backgroundColor: "rgba(0,255,255,0.25)",
                              borderRadius: "20px",
                              fontSize: "24px",
                              padding: "8px"
                          }} />}
                      title={"Staff"}
                      value={countStaff()} />
                  <DashboardCard
                      icon={<HeartOutlined
                          style={{
                              color: "red",
                              backgroundColor: "rgba(255,0,0,0.25)",
                              borderRadius: "20px",
                              fontSize: "24px",
                              padding: "8px"
                          }} />}
                      title={"Events"}
                      value={4} />
              </Space>
              {/* <Space>
                  <ResentOrder/>
                  <DashboardChart/>
              </Space> */}
              </Space>
          </div>
      );
}

function DashboardCard({ title, value, icon }) {
    return (
        <Card>
            <Space direction="horizontal">
                {icon}
                <Statistic title={title} value={value} />
            </Space>
        </Card>
    );
}

export default Provider_pagecontent
