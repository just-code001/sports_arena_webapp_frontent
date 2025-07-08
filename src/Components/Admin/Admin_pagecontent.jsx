import { DollarCircleOutlined, HeartOutlined, ShopOutlined, ShoppingCartOutlined, TeamOutlined, UserOutlined, UsergroupAddOutlined, WomanOutlined } from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { First } from "react-bootstrap/esm/PageItem";
// import { getCustomer, getInventory, getUser, getRevenue } from "../../API/Api_index";
// import Admin_approute from "./Admin_approute";
// import { getClient ,getStaff, getManager} from "../../API/Api_index";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

function Admin_pagecontent() {

    const [orders,setOrders]=useState(0);
    const [inventory,setInventory]=useState(0);
    const [customers,setCustomers]=useState(0);
    const [revenue,setRevenue]=useState(0);

    // useEffect(()=>{
    //     getUser().then(res=>{
    //         setOrders(res.total);
    //         setRevenue(res.discountedTotal)
    //     });
    //     getInventory().then(res=>{
    //         setInventory(res.total);
    //     });
    //     getCustomer().then(res=>{
    //         setCustomers(res.total);
    //     });
        
    // },[])

    const [client, setClient] = useState([]);
    const [staff, setStaff] = useState([]);
    const [manager, setManager] = useState([]);

    // const fetchClientData = async () => {
    //     try {
    //         const resu = await getClient();
    //         setClient(resu.client);
    //         console.log(resu.client)

    //         const res = await getStaff();
    //         setStaff(res.users);
    //         console.log(res.users)

    //         const result = await getManager();
    //         setManager(result.users);
    //         console.log(result.users)
    //     } catch (error) {
    //         console.error('Error fetching order:', error);
    //         // Handle the error gracefully, e.g., show a message to the user
    //     }
    // };
    // useEffect(() => {

    //     fetchClientData();

    // }, []);

    const countClients = () => client.length;
    const countStaff=()=>staff.length;
    const countManager=()=>manager.length;

    return (
        <div className="Admin_pagecontent">
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
                <DashboardCard
                    icon={<WomanOutlined
                        style={{
                            color: "blue",
                            backgroundColor: "rgba(0,0,255,0.25)",
                            borderRadius: "20px",
                            fontSize: "24px",
                            padding: "8px"
                        }} />}
                    title={"Managers"}
                    value={countManager()} />
                <DashboardCard
                    icon={<TeamOutlined
                        style={{
                            color: "purple",
                            backgroundColor: "rgba(0,255,255,0.25)",
                            borderRadius: "20px",
                            fontSize: "24px",
                            padding: "8px"
                        }} />}
                    title={"Staffs"}
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
            <Space>
                {/* <ResentOrder/>
                <DashboardChart/> */}
            </Space>
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

// function ResentOrder(){

//     const[dataSource,setDataSource]=useState([])
//     const[loading,setLoading]=useState(false)

//     useEffect(()=>{
//         setLoading(true)
//         getUser().then(res=>{
//             // setDataSource(res.products.splice(0,3));
//             setLoading(false);
//         })
//     },[])
//     return(
//         <>
//         <Typography.Text>recent orders</Typography.Text>

//         <Table
//             columns={[
//                 {
//                 title:"title",
//                 dataIndex:"title",
//             },
//             {
//                 title:"Quantity",
//                 dataIndex:"quantity",
//             },
//             {
//                 title:"Price",
//                 dataIndex:"discountedPrice",
//             },
//             ]}
//             loading={loading}
//             dataSource={dataSource}
//             pagination={false}
//         ></Table>
//         </>
//     );
// }

// function DashboardChart(){

//     const [revenueData,setRevenueData]=useState({
//         labels:[],
//         datasets:[]
//     })

//     useEffect(()=>{
        // getRevenue().then(res=>{
        //     const labels=res.carts.map(cart=>{
        //         return `User-${cart.userId}`;
        //     });

        //     const data=res.carts.map(cart=>{
        //         return cart.discountedTotal;
        //     });

        //     const dataSource={

        //         labels,
        //         datasets: [
        //   {
        //     label: 'revenue',
        //     data: data,
        //     backgroundColor: 'rgba(255, 0, 0, 1)',
        //   }
        // ],
        //     };

        //     setRevenueData(dataSource)

        // });
    // },[]);


    // const options = {
    //     responsive: true,
    //     plugins: {
    //       legend: {
    //         position: 'bottom',
    //       },
    //       title: {
    //         display: true,
    //         text: 'Order revenue',
    //       },
    //     },
    //   };

    //   const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    //   const data = {
    //     labels,
    //     datasets: [
    //       {
    //         label: 'Dataset 1',
    //         data: labels.map(() => Math.random()*1000),
    //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
    //       },
    //       {
    //         label: 'Dataset 2',
    //         data: labels.map(() => Math.random()*1000),
    //         backgroundColor: 'rgba(53, 162, 235, 0.5)',
    //       },
    //     ],
    //   };

//     return <Card style={{width:"500px",height:"350px"}}>
//          <Bar options={options} data={revenueData} />
//          </Card>;
// }

export default Admin_pagecontent;