import { Badge, Drawer, List, Space, Typography } from 'antd';
import myimage12 from './image/myimage12.png';
import { BellFilled, CommentOutlined, HomeOutlined, MailOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
// import { getReview, getUser } from '../../API/Api_index';
import { Navigate } from 'react-router-dom';

function Admin_header(){
const [review,setreview]=useState([]);
const[reviewOpen,setreviewOpen]=useState(false);


// useEffect(()=>{
//     getReview().then(res=>{
//         setreview(res.reviews)
//     });
    
// },[])

    return( 
        <div className="Admin_header">
            <HomeOutlined
            style={{
                color: "black",
                // backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: "20px",
                fontSize: "40px",
                padding: "8px"
            }}/>
            {/* <img src={{}} alt="" width={40} height={40} /> */}
            <Typography.Title>Admin Dashboard</Typography.Title>
            <Space>
            <Badge count={review.length} dot>
                <CommentOutlined style={{fontSize:"24px"}} onClick={()=>{
                    setreviewOpen(true);
                }} />
                </Badge>

             {/* <Badge >
                <BellFilled style={{fontSize:"24px"}} onClick={()=>{
                    Navigate("/");
                }} />   
                </Badge> */}
            </Space>
            
            <Drawer title="review" open={reviewOpen} onClose={()=>{
                setreviewOpen(false)
            }} maskClosable>
                <List dataSource={review} renderItem={(item)=>{
                    return <List.Item>{item.message}</List.Item>
                }}></List>
            </Drawer>

        </div>
    );
}
export default Admin_header;