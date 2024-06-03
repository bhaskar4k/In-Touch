import { React, useState, useEffect } from 'react';
import '../CSS for Components/Notification.css';
import { io } from 'socket.io-client';

const socket = io.connect("http://localhost:4000");

function Notification(props) {
    //const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));

    useEffect(() => {
        if (props.notification.length > 0) {
            document.getElementById("no_notifications").style.display = "none";
        }
    })

    return (
        <>
            <div className='notification_grandparent'>
                <div id="notification_parent">
                    <p id="no_notifications">No notifications...</p>
                    {props.notification}
                </div>
            </div>
        </>
    );
}

export default Notification