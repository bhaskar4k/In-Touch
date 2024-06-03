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
    const [login_user_profile_page_url, set_login_user_profile_page_url] = useState("");
    const [login_user_profile_photo, set_login_user_profile_photo] = useState(default_user_logo);
    const [setting_component_visible, set_setting_component_visible] = useState(false);
    const [create_post_component_visible, set_create_post_component_visible] = useState(false);
    const [notification_visible, set_notification_visible] = useState(false);
    const [noti, set_noti] = useState([]);
    const [pending_noti, set_pending_noti] = useState(0);
    //#endregion


    //#region Getting profile photo of loggedin user and setting loggedin user's profile page url 
    useEffect(() => {
        if (user_login_info_from_cache !== null) {
            get_profile_photo(user_login_info_from_cache.user_name);
            set_login_user_profile_page_url("http://localhost:3000/profile/" + user_login_info_from_cache.user_name);
        } else {
            navigate(`/home`);
        }
    }, []);
    //#endregion


    // #region Function to open/close settings modal----------
    function setting() {
        if (document.getElementById("settings_div").style.height === "0px") {
            // If create post div is opened then close it
            if (document.getElementById("create_post_div").style.height === "400px") {
                setTimeout(function () {
                    set_create_post_component_visible(false);
                }, 300);
                document.getElementById("create_post_div").style.height = "0px";
                document.getElementById("create_post_div").style.width = "0px";
                document.getElementById("create_post_div").style.border = "none";
            }

            // If change profile photo div is opened then close
            if (document.getElementById("container_changeProfilePhotoComponent") !== null && document.getElementById("container_changeProfilePhotoComponent").style.height === "560px") {
                document.getElementById("container_changeProfilePhotoComponent").style.height = "0px";
                document.getElementById("container_changeProfilePhotoComponent").style.width = "0px";
                document.getElementById("profile_dashboard_container").style.filter = "blur(0px)";
                document.getElementById("rest_of_profile").style.filter = "blur(0px)";
            }

            if (document.getElementById("profile_container") !== null) {
                document.getElementById("profile_container").style.filter = "blur(5px)";
            }

            if (document.getElementById("actual_feed_container") !== null) {
                document.getElementById("actual_feed_container").style.filter = "blur(5px)";
            }

            set_setting_component_visible(true);
            document.getElementById("settings_div").style.height = "600px";
            document.getElementById("settings_div").style.width = "700px";
            document.getElementById("settings_div").style.border = "2px solid rgb(0, 140, 255)";
        } else {
            setTimeout(function () {
                set_setting_component_visible(false);
                if (document.getElementById("profile_container") !== null) {
                    document.getElementById("profile_container").style.filter = "blur(0px)";
                    document.getElementById("rest_of_profile").style.filter = "blur(0px)";
                }
                if (document.getElementById("actual_feed_container") !== null) {
                    document.getElementById("actual_feed_container").style.filter = "blur(0px)";
                }
            }, 300);
            document.getElementById("settings_div").style.height = "0px";
            document.getElementById("settings_div").style.width = "0px";
            document.getElementById("settings_div").style.border = "none";
        }
    }
    // #endregion --------------------------------------------


    // #region Function to logout/Clearing user_data from cache
    function logout() {
        if (localStorage.getItem("touch__user_login_info") !== null) {
            localStorage.removeItem("touch__user_login_info");
            localStorage.removeItem("previously_searched_profiles");
        }
        navigate(`/home`);
    }
    // #endregion ---------------------------------------------------


    // #region Function to open/close the user activity modal
    function control_user_setting_activity_window() {
        if (document.getElementById("user_setting_activity").style.height === "0px") {
            document.getElementById("user_setting_activity").style.height = "180px";
            //document.getElementById("user_setting_activity").style.padding = "10px";
        } else {
            document.getElementById("user_setting_activity").style.height = "0px";
            //document.getElementById("user_setting_activity").style.padding = "0px";
        }
    }
    // #endregion ---------------------------------------------


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

    function redirect_to_chatbox() {
        navigate("/chat");
    }
    //#endregion


    //#region Open/close create post component
    function open_create_post() {
        if (document.getElementById("create_post_div").style.height === "0px") {
            // Closing setting div if it is open
            if (document.getElementById("settings_div").style.height === "600px") {
                setTimeout(function () {
                    set_setting_component_visible(false);
                }, 300);
                document.getElementById("settings_div").style.height = "0px";
                document.getElementById("settings_div").style.width = "0px";
                document.getElementById("settings_div").style.border = "none";
            }

            // If change profile photo div is opened then close
            if (document.getElementById("container_changeProfilePhotoComponent") !== null && document.getElementById("container_changeProfilePhotoComponent").style.height === "560px") {
                document.getElementById("container_changeProfilePhotoComponent").style.height = "0px";
                document.getElementById("container_changeProfilePhotoComponent").style.width = "0px";
                document.getElementById("profile_dashboard_container").style.filter = "blur(0px)";
                document.getElementById("rest_of_profile").style.filter = "blur(0px)";
            }

            if (document.getElementById("profile_container") !== null) {
                document.getElementById("profile_container").style.filter = "blur(5px)";
            }
            if (document.getElementById("ultimate_parent_of_feed") !== null) {
                document.getElementById("ultimate_parent_of_feed").style.filter = "blur(5px)";
            }

            set_create_post_component_visible(true);

            document.getElementById("create_post_div").style.height = "400px";
            document.getElementById("create_post_div").style.width = "700px";
            document.getElementById("create_post_div").style.border = "3px solid rgb(0, 140, 255)";
        } else {
            setTimeout(function () {
                set_create_post_component_visible(false);
                if (document.getElementById("profile_container") !== null) {
                    document.getElementById("profile_container").style.filter = "blur(0px)";
                }
                if (document.getElementById("ultimate_parent_of_feed") !== null) {
                    document.getElementById("ultimate_parent_of_feed").style.filter = "blur(0px)";
                }
            }, 300);
            document.getElementById("create_post_div").style.height = "0px";
            document.getElementById("create_post_div").style.width = "0px";
            document.getElementById("create_post_div").style.border = "none";
        }
    }

    function close_create_post() {
        setTimeout(function () {
            set_create_post_component_visible(false);
            if (document.getElementById("profile_container") !== null) {
                document.getElementById("profile_container").style.filter = "blur(0px)";
            }
            if (document.getElementById("ultimate_parent_of_feed") !== null) {
                document.getElementById("ultimate_parent_of_feed").style.filter = "blur(0px)";
            }
        }, 300);
        document.getElementById("create_post_div").style.height = "0px";
        document.getElementById("create_post_div").style.width = "0px";
        document.getElementById("create_post_div").style.border = "none";
    }
    //#endregion


    //#region Populate comment from socket
    useEffect(() => {
        const load_notifications = async (cmnt) => {
            let commentator = cmnt.username;
            let post_id = cmnt.post_id;
            let post_owner = "", temp = "";

            for (let i = 5; i < post_id.length; i++) {
                if (post_id[i] === '|') {
                    post_owner = temp;
                    break;
                }
                temp += post_id[i];
            }

            if (user_login_info_from_cache.user_name === post_owner && commentator !== post_owner) {
                let url = "http://localhost:3000/profile/" + commentator;

                let notification = (
                    <div className="a_single_noti_parent">
                        <a href={url} target='_blank' rel="noreferrer">
                            <div className="a_single_noti_dp">
                                <img src={default_user_logo} alt="Notification DP" />
                            </div>
                        </a>
                        <p className="a_single_noti"><a href={url} className="link_clear" target='_blank' rel="noreferrer">{commentator}</a> commented on your post.</p>
                    </div>
                );

                try {
                    let response = await fetch('http://localhost:8080/get_profile_photo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: commentator
                    })

                    let dataa = await response.json();

                    if (dataa.profile_photo !== "NULL") {
                        notification = (
                            <div className="a_single_noti_parent">
                                <a href={url} target='_blank' rel="noreferrer">
                                    <div className="a_single_noti_dp">
                                        <img src={"data:image/jpeg;base64," + dataa.profile_photo} alt="Notification DP" />
                                    </div>
                                </a>
                                <p className="a_single_noti"><a href={url} className="link_clear" target='_blank' rel="noreferrer">{commentator}</a> commented on your post.</p>
                            </div>
                        );
                    }
                } catch (error) {
                    console.log(error);
                }

                set_pending_noti(pending_noti => pending_noti + 1);
                document.getElementById("pending_noti").style.display = "block";
                set_noti(noti => [notification, ...noti]);
            }
        };

        socket.on('receive_push_comment', load_notifications);

        return () => {
            socket.off('receive_push_comment', load_notifications);
        };
    }, [socket]);
    //#endregion


    //#region Populate like from socket
    useEffect(() => {
        const load_notifications = async (like) => {
            if (like.is_liked === false) return;
            let who_liked = like.username;
            let post_id = like.post_id;
            let post_owner = "", temp = "";

            for (let i = 5; i < post_id.length; i++) {
                if (post_id[i] === '|') {
                    post_owner = temp;
                    break;
                }
                temp += post_id[i];
            }

            if (user_login_info_from_cache.user_name === post_owner && who_liked !== post_owner) {
                let url = "http://localhost:3000/profile/" + who_liked;

                let notification = (
                    <div className="a_single_noti_parent">
                        <a href={url} target='_blank' rel="noreferrer">
                            <div className="a_single_noti_dp">
                                <img src={default_user_logo} alt="Notification DP" />
                            </div>
                        </a>
                        <p className="a_single_noti"><a href={url} className="link_clear" target='_blank' rel="noreferrer">{who_liked}</a> liked your post.</p>
                    </div>
                );

                try {
                    let response = await fetch('http://localhost:8080/get_profile_photo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: who_liked
                    })

                    let dataa = await response.json();

                    if (dataa.profile_photo !== "NULL") {
                        notification = (
                            <div className="a_single_noti_parent">
                                <a href={url} target='_blank' rel="noreferrer">
                                    <div className="a_single_noti_dp">
                                        <img src={"data:image/jpeg;base64," + dataa.profile_photo} alt="Notification DP" />
                                    </div>
                                </a>
                                <p className="a_single_noti"><a href={url} className="link_clear" target='_blank' rel="noreferrer">{who_liked}</a> liked your post.</p>
                            </div>
                        );
                    }
                } catch (error) {
                    console.log(error);
                }

                set_pending_noti(pending_noti => pending_noti + 1);
                document.getElementById("pending_noti").style.display = "block";
                set_noti(noti => [notification, ...noti]);
            }
        };

        socket.on('receive_push_like', load_notifications);

        return () => {
            socket.off('receive_push_like', load_notifications);
        };
    }, [socket]);
    //#endregion


    //#region Populate follow from socket
    useEffect(() => {
        const load_notifications = async (follow) => {
            let username = follow.username;
            let followed_by_username = follow.followed_by_username;
            let is_followed = follow.is_followed;
            let follower_count = follow.follower_count;
            let following_count = follow.following_count;

            if (is_followed === true && user_login_info_from_cache.user_name === username) {
                let url = "http://localhost:3000/profile/" + followed_by_username;

                let notification = (
                    <div className="a_single_noti_parent">
                        <a href={url} target='_blank' rel="noreferrer">
                            <div className="a_single_noti_dp">
                                <img src={default_user_logo} alt="Notification DP" />
                            </div>
                        </a>
                        <p className="a_single_noti"><a href={url} className="link_clear" target='_blank' rel="noreferrer">{followed_by_username}</a> followed you.</p>
                    </div>
                );

                try {
                    let response = await fetch('http://localhost:8080/get_profile_photo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: followed_by_username
                    })

                    let dataa = await response.json();

                    if (dataa.profile_photo !== "NULL") {
                        notification = (
                            <div className="a_single_noti_parent">
                                <a href={url} target='_blank' rel="noreferrer">
                                    <div className="a_single_noti_dp">
                                        <img src={"data:image/jpeg;base64," + dataa.profile_photo} alt="Notification DP" />
                                    </div>
                                </a>
                                <p className="a_single_noti"><a href={url} className="link_clear" target='_blank' rel="noreferrer">{followed_by_username}</a> followed you.</p>
                            </div>
                        );
                    }
                } catch (error) {
                    console.log(error);
                }

                set_pending_noti(pending_noti => pending_noti + 1);
                document.getElementById("pending_noti").style.display = "block";
                set_noti(noti => [notification, ...noti]);
            }

            const page_url = window.location.href;

            if (page_url.length >= 30 && page_url[22] === 'p') {
                let requested_username = "";

                for (let i = 30; i < page_url.length; i++) {
                    requested_username += page_url[i];
                }

                if (requested_username === username) {
                    if (document.getElementById("follower") !== null) {
                        document.getElementById("follower").innerHTML = follower_count + " Follower";
                    }
                }

                if (requested_username === followed_by_username) {
                    if (document.getElementById("following") !== null) {
                        document.getElementById("following").innerHTML = following_count + " Following";
                    }
                }
            }
        };

        socket.on('receive_follow', load_notifications);

        return () => {
            socket.off('receive_follow', load_notifications);
        };
    }, [socket]);
    //#endregion


    //#region Open/close notificaton component
    function open_notification() {
        if (document.getElementById("notification_div").style.maxHeight === "0px") {
            if (document.getElementById("profile_container") !== null) {
                document.getElementById("profile_container").style.filter = "blur(5px)";
            }
            if (document.getElementById("ultimate_parent_of_feed") !== null) {
                document.getElementById("ultimate_parent_of_feed").style.filter = "blur(5px)";
            }

            set_notification_visible(true);

            document.getElementById("notification_div").style.maxHeight = "400px";
            document.getElementById("notification_div").style.width = "380px";
            document.getElementById("pending_noti").style.display = "none";

            set_pending_noti(0);
        } else {
            setTimeout(function () {
                set_notification_visible(false);
                if (document.getElementById("profile_container") !== null) {
                    document.getElementById("profile_container").style.filter = "blur(0px)";
                }
                if (document.getElementById("ultimate_parent_of_feed") !== null) {
                    document.getElementById("ultimate_parent_of_feed").style.filter = "blur(0px)";
                }
            }, 300);
            document.getElementById("notification_div").style.maxHeight = "0px";
            document.getElementById("notification_div").style.width = "0px";

            set_pending_noti(0);
        }
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

                        <Searchbar />
                    </div>

                    <div className='header_controls_parent'>
                        <div className='create_post_button'>
                            <div className='noti_div'>
                                <FontAwesomeIcon icon={faBell} onClick={open_notification} />
                                <p id='pending_noti'>{pending_noti}</p>
                            </div>
                            <div className='post_and_chatting_icon'>
                                <FontAwesomeIcon icon={faSquarePlus} onClick={open_create_post} />
                                <FontAwesomeIcon icon={faComments} onClick={redirect_to_chatbox} />
                            </div>
                        </div>
                        <div className='header_controls'>
                            <img src={login_user_profile_photo} alt="default user logo" onClick={control_user_setting_activity_window} />
                        </div>
                        <div id="user_setting_activity">
                            <div className='user_activity_container'>
                                <a className='button1' href={login_user_profile_page_url}>Profile</a>
                                <p className='button1' onClick={setting}>Settings</p>
                                <p className='button1' onClick={logout}>Logout</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div id="settings_div">
                {setting_component_visible && <Settings />}
            </div>

            <div id="create_post_div">
                {create_post_component_visible &&
                    <div>
                        <div id="settings_close_btn">
                            <FontAwesomeIcon icon={faTimes} onClick={close_create_post} />
                        </div>
                        <CreatePost />
                    </div>
                }
            </div>


            <div style={{ width: '1200px', margin: '0 auto', position: 'relative' }}>
                <div id="notification_div">
                    {notification_visible && <Notification notification={noti} />}
                </div>
            </div>
        </>
    );
}

export default Header;
