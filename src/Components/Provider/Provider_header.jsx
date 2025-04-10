import { Badge, Drawer, List, Space, Typography } from 'antd';
// import myimage12 from './image/myimage12.png';
import { BellFilled, HomeOutlined, MailOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
// import { getComments, getUser } from '../../API/Api_index';

const Provider_header = () => {
    const [comments,setComments]=useState([]);
const[orders,setOrders]=useState([]);
const[commentsOpen,setCommentsOpen]=useState(false);
const[notificationOpne,setNotificationOpen]=useState(false);

// useEffect(()=>{
//     getComments().then(res=>{
//         setComments(res.comments)
//     });
//     getUser().then(res=>{
//         setOrders(res.products)
//     });
// },[])
    return( 
        <div className="Eventmanager_header">
            <HomeOutlined
            style={{
                color: "black",
                backgroundColor: "rgba(192, 192, 192, 1)",
                borderRadius: "10px",
                fontSize: "40px",
                padding: "8px"
            }}/>
            <Typography.Title>Provider Dashboard</Typography.Title>
            <Space>
            <Badge count={comments.length} dot>
                <MailOutlined style={{fontSize:"24px"}} onClick={()=>{
                    setCommentsOpen(true);
                }} />
                </Badge>
             <Badge >
                <BellFilled style={{fontSize:"24px"}} onClick={()=>{
                    setNotificationOpen(true);
                }} />
                </Badge>
            </Space>
            <Drawer title="Comments" open={commentsOpen} onClose={()=>{
                setCommentsOpen(false)
            }} maskClosable>
                <List dataSource={comments} renderItem={(item)=>{
                    return <List.Item>{item.body}</List.Item>
                }}></List>
            </Drawer>

<Drawer title="Notificatins" open={notificationOpne} onClose={()=>{
                setNotificationOpen(false)
            }} maskClosable>
{/* <List dataSource={} renderItem={(item)=>{
                    return <List.Item><Typography.Text strong>{item.title} </Typography.Text> has been orderd!</List.Item>
                }}></List> */}

            </Drawer>
        </div>
    );
}

export default Provider_header
