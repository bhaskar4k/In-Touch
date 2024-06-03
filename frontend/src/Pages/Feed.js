import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import DisplayFeed from '../Components/DisplayFeed';
import '../CSS for Components/Feed.css';

function Feed() {
    //#region Global declarations
    const navigate = useNavigate();
    const [loggedin_person_user_name, set_loggedin_person_user_name] = useState(null);
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    //#endregion


    //#region Checking if session is active else route to signup/login page 
    useEffect(() => {
        if (user_login_info_from_cache !== null) {
            set_loggedin_person_user_name(user_login_info_from_cache.user_name);
            let screen_height = window.innerHeight;
            document.getElementById("ultimate_parent_of_feed").style.height = "" + (screen_height - 70) + "px";
            document.title = 'Feed/@' + user_login_info_from_cache.user_name;
        } else {
            navigate(`/home`);
        }
    }, []);
    //#endregion

    return (
        <>
            <Header />
            <div id="ultimate_parent_of_feed">
                <div id="actual_feed_container">
                    <DisplayFeed />
                </div>
            </div>
        </>
    );
}

export default Feed;
