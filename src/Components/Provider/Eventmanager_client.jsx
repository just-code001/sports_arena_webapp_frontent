import { Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getClient } from "../../API/Api_index";

function Eventmanger_client(){
    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])
    
const fetchClientData = async () => {
    try {
        setLoading(true);
        const res = await getClient();
        setDataSource(res.client);
        console.log(res.client)
    } catch (error) {
        console.error('Error fetching order:', error);
        // Handle the error gracefully, e.g., show a message to the user
    } finally {
        setLoading(false);
    }
};
useEffect(() => {

    fetchClientData();
}, []);
return(
<div className="Eventmanager_pagecontent">
            <Space size={20} direction="vertical">
                <Typography.Title level={4}>Staff</Typography.Title>



                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "first name",
                            dataIndex: "firstname"
                        },
                        {
                            title: "last name",
                            dataIndex: "lastname"
                        },
                        {
                            title: "Email",
                            dataIndex: "email",
                        },
                        {
                            title: "Mobile No.",
                            dataIndex: "phno",
                        },
                    ]}
                    dataSource={dataSource}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>
            </Space>
        </div>
        
);

}
export default Eventmanger_client;