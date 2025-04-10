import React from 'react'
import { Typography } from "antd";

const Provider_footer = () => {
    return( 
        <div className="Eventmanager_footer">
            <Typography.Link href="tel:+123456789">+123456789</Typography.Link>
            <Typography.Link href="https://www.google.com" target={"_blank"}>privacy policy</Typography.Link>
            <Typography.Link href="https://www.google.com" target={"_blank"}> terms of use</Typography.Link>
        </div>
    );
}

export default Provider_footer
