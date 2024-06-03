import { React, useState, useEffect } from 'react';
import '../CSS for Components/UserProfileDashboard.css';
import ChangeProfilePhoto from '../Components/ChangeProfilePhoto';
import ViewImage from '../Components/ViewImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import FollowingList from '../Components/FollowingList';
import FollowerList from '../Components/FollowerList';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io.connect("http://localhost:4000");

function UserProfileDashboard(props) {
    //#region Global declarations
    let loggedin_user_data = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const navigate = useNavigate();

    const [my_profile, set_my_profile] = useState(null); // true=my pfl, false=other pfl
    const page_url = window.location.href;
    let requested_username = "";

    for (let i = 30; i < page_url.length; i++) {
        requested_username += page_url[i];
    }

    const [view_clicked_image, set_view_clicked_image] = useState(null);
    const [follow_btn_color, set_follow_btn_color] = useState("rgb(0, 140, 255)");
    const [follow_btn_text, set_follow_btn_text] = useState("Follow");
    const [follower_count, set_follower_count] = useState(0);
    const [following_count, set_following_count] = useState(0);
    const [show_following_list, set_show_following_list] = useState(false);
    const [show_follower_list, set_show_follower_list] = useState(false);
    //#endregion


    //#region Setting_my_profile variable true/false to know if it's loggedin user's profile
    useEffect(() => {
        if (loggedin_user_data.user_name === requested_username) {
            set_my_profile(true);
        } else {
            set_my_profile(false);
        }
        fetch_follower_and_following_info();
    }, []);
    //#endregion


    //#region Fetch follower and following info
    async function fetch_follower_and_following_info() {
        let response = await fetch("http://localhost:4000/api/get_follower_and_following_info/" + requested_username, { method: 'GET' });

        if (response.status === 200) {
            let info = await response.json();

            set_follower_count(info.follower_count);
            set_following_count(info.following_count);
        }

        response = await fetch("http://localhost:4000/api/is_followerd/" + requested_username + "/" + loggedin_user_data.user_name, { method: 'GET' });

        if (response.status === 200) {
            let info = await response.json();

            if (info.is_followed === true) {
                set_follow_btn_color("#525252");
                set_follow_btn_text("Unfollow");
            } else {
                set_follow_btn_color("rgb(0, 140, 255)");
                set_follow_btn_text("Follow");
            }
        }
    }
    //#endregion


    //#region Open/Close Profile photo change area
    const [photo_change_component_visible, set_photo_change_component_visible] = useState(false);
    function open_changeProfilePhotoComponent() {
        set_photo_change_component_visible(true);
        document.getElementById("profile_dashboard_container").style.filter = "blur(5px)";
        document.getElementById("rest_of_profile").style.filter = "blur(5px)";
        document.getElementById("container_changeProfilePhotoComponent").style.height = "560px";
        document.getElementById("container_changeProfilePhotoComponent").style.width = "664px";
    }

    function close_changeProfilePhotoComponent() {
        setTimeout(function () {
            set_photo_change_component_visible(false);
            document.getElementById("profile_dashboard_container").style.filter = "blur(0px)";
            document.getElementById("rest_of_profile").style.filter = "blur(0px)";
        }, 300);
        document.getElementById("container_changeProfilePhotoComponent").style.height = "0px";
        document.getElementById("container_changeProfilePhotoComponent").style.width = "0px";
    }
    //#endregion


    //#region Open/close View image controller
    function view_image(url) {
        set_view_clicked_image(<ViewImage url={url} />);
        document.getElementById("view_image").style.display = "block";
    }

    function close_view_image() {
        set_view_clicked_image(null);
        document.getElementById("view_image").style.display = "none";
    }
    //#endregion


    //#region Do follow
    async function do_follow() {
        let follow_info = {
            "username": requested_username,
            "followed_by_username": loggedin_user_data.user_name
        }
        try {
            let response = await fetch("http://localhost:4000/api/do_follow", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(follow_info)
            })

            if (response.status === 200) {
                let follow = await response.json();

                if (follow.is_followed === true) {
                    set_follow_btn_color("#525252");
                    set_follow_btn_text("Unfollow");
                } else {
                    set_follow_btn_color("rgb(0, 140, 255)");
                    set_follow_btn_text("Follow");
                }
                socket.emit('send_follow', follow);
            }
        } catch {
            console.log("error")
        }
    }
    //#endregion


    //#region Open close follower and following list
    function display_follower_list() {
        if (document.getElementById("follower_list_parent").style.maxHeight === "0px") {
            setTimeout(() => {
                document.getElementById("follower_list_parent").style.maxHeight = "400px";
            }, 300)

            set_show_follower_list(true);
            if ((document.getElementById("following_list_parent").style.maxHeight === "400px")) {
                display_following_list();
            }
        } else {
            document.getElementById("follower_list_parent").style.maxHeight = "0px";
            setTimeout(() => {
                set_show_follower_list(false);
            }, 300)
        }
    }


    function display_following_list() {
        if (document.getElementById("following_list_parent").style.maxHeight === "0px") {
            setTimeout(() => {
                document.getElementById("following_list_parent").style.maxHeight = "400px";
            }, 300)

            set_show_following_list(true);
            if ((document.getElementById("follower_list_parent").style.maxHeight === "400px")) {
                display_follower_list();
            }
        } else {
            document.getElementById("following_list_parent").style.maxHeight = "0px";
            setTimeout(() => {
                set_show_following_list(false);
            }, 300)
        }
    }
    //#endregion


    //#region
    function send_message() {
        let url = `/chat/${requested_username}`;

        navigate(url);
    }
    //#endregion

    return (
        <>
            <div id='profile_dashboard_container'>
                <div className='profile_dashboard_image_container'>
                    <img src={props.profile_photo} alt="Thobra" onClick={() => view_image(props.profile_photo)}></img>
                </div>
                <div className='profile_dashboard_info_container'>
                    <div className='profile_username_follower_following_container'>
                        <h1 className='profile_user_name'>@{props.user_name}</h1>
                        <button id="follower" onClick={display_follower_list}>{follower_count} Follower</button>
                        <button id="following" onClick={display_following_list}>{following_count} Following</button>
                    </div>

                    <h1 className='profile_bio'>{props.bio}</h1>

                    <div className='pfl_dashboard_buttons'>
                        {my_profile && <button onClick={open_changeProfilePhotoComponent}>Update Photo</button>}
                        {!my_profile && <button onClick={do_follow} style={{ backgroundColor: follow_btn_color }}>{follow_btn_text}</button>}
                        {!my_profile && <button onClick={send_message} className='message_btn'>Message</button>}
                    </div>
                </div>
            </div>

            <div id="follower_list_parent">
                <p className='following_follower_list_heading'>Follower List</p>
                {show_follower_list && <FollowerList username={props.user_name} />}
            </div>
            <div id="following_list_parent">
                <p className='following_follower_list_heading'>Following List</p>
                {show_following_list && <FollowingList username={props.user_name} />}
            </div>

            {my_profile &&
                <div id='container_changeProfilePhotoComponent'>
                    {photo_change_component_visible && <div id='close_changeProfilePhotoComponent' onClick={close_changeProfilePhotoComponent}><FontAwesomeIcon icon={faTimes} /></div>}
                    {photo_change_component_visible && <ChangeProfilePhoto requested_username={loggedin_user_data.user_name} />}
                </div>
            }


            <div id='view_image'>
                <div className="view_image_close_btn"><FontAwesomeIcon icon={faTimes} onClick={close_view_image} /></div>
                {view_clicked_image}
            </div>
        </>
    );
}

export default UserProfileDashboard;
