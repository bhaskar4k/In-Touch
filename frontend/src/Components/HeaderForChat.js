import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS for Components/Header.css';
import Searchbar from '../Components/Searchbar.js';
import Settings from '../Components/Settings';
import CreatePost from '../Components/CreatePost';
import Notification from '../Components/Notification';
import default_user_logo from '../Images/Default User Logo 2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus, faTimes, faBell, faComments } from '@fortawesome/free-solid-svg-icons'
import { io } from 'socket.io-client';

const socket = io.connect("http://localhost:4000");
//let noti_dp = "";

function Header() {
    //#region Global declarations
    const navigate = useNavigate();
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [login_user_profile_photo, set_login_user_profile_photo] = useState(default_user_logo);
    //#endregion


    //#region Getting profile photo of loggedin user and setting loggedin user's profile page url 
    useEffect(() => {
        if (user_login_info_from_cache !== null) {
            get_profile_photo(user_login_info_from_cache.user_name);
        } else {
            navigate(`/home`);
        }
    }, []);
    //#endregion


    //#region Get profile photo from database
    async function get_profile_photo(user_name) {
        let dataa = {
            user_name: user_name,
            profile_photo: "NULL"
        };
        try {
            let response = await fetch('http://localhost:8080/get_profile_photo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: user_name
            })

            dataa = await response.json();
            if (dataa.profile_photo !== "NULL") {
                set_login_user_profile_photo("data:image/jpeg;base64," + dataa.profile_photo)
            }
        } catch {
            console.log("Internal server error");
        }
    }
    //#endregion


    //#region Navigations
    function get_back_to_feed() {
        navigate("/feed");
    }
    //#endregion


    return (
        <>
            <div className='parent_of_header' id='parent_of_header'>
                <div className='child_of_header'>
                    <div style={{ display: 'flex' }}>
                        <div className='app_name'>
                            <h1 onClick={get_back_to_feed}>In Touch</h1>
                        </div>
                    </div>
                    <div className='header_controls'>
                        <img src={login_user_profile_photo} alt="default user logo" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
