import '../CSS for Components/Profile.css';
import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import DisplayAllPosts from '../Components/DisplayAllPosts';
import default_user_logo from '../Images/Default User Logo 2.jpg';
import UserProfileDashboard from '../Components/UserProfileDashboard';

function Profile() {
    //#region Global declarations
    const navigate = useNavigate();
    const [loggedin_person_user_name, set_loggedin_person_user_name] = useState(null);
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const page_url = window.location.href;
    let requested_username = "";
    const [requested_user_bio, set_requested_user_bio] = useState("");
    const [requested_user_photo, set_requested_user_photo] = useState(default_user_logo);
    const [valid_profile, set_valid_profile] = useState(false);

    for (let i = 30; i < page_url.length; i++) {
        requested_username += page_url[i];
    }
    //#endregion


    //#region Is it a valid profile?
    async function is_it_a_valid_profile() {
        try {
            let response = await fetch('http://localhost:8080/is_it_a_valid_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requested_username
            })

            let value = await response.text();

            if (value === "not_ok") {
                navigate("/error");
            }
        } catch {
            console.log("Internal server error mkc");
        }
    }
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
            if (dataa.profile_photo !== "NULL") set_requested_user_photo("data:image/jpeg;base64," + dataa.profile_photo)
        } catch {
            console.log("Internal server error");
        }
    }
    //#endregion


    //#region Get user bio from database
    async function get_user_bio(user_name) {
        try {
            try {
                let response = await fetch('http://localhost:8080/get_user_bio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: user_name
                })

                set_requested_user_bio(await response.text());
            } catch {
                console.log("Internal server error");
            }
        } catch (error) {
            console.log("Internal server error in getting user data in profile.");
        }
    }
    //#endregion


    //#region UseEffect
    useEffect(() => {
        if (user_login_info_from_cache !== null) {
            is_it_a_valid_profile();

            let screen_height = window.innerHeight;
            document.getElementById("profile_container").style.height = "" + (screen_height - 80) + "px";
            set_loggedin_person_user_name(user_login_info_from_cache.user_name);
            document.title = 'Profile/@' + requested_username;

            get_profile_photo(requested_username);

            if (user_login_info_from_cache.user_name !== requested_username) {
                update_previously_searched_cache(requested_username);
                get_user_bio(requested_username);
            } else {
                set_requested_user_bio(user_login_info_from_cache.bio);
            }
        } else {
            navigate(`/home`);
        }
    }, []);
    //#endregion 


    //#region Update the searched user cache when a new profile has been opened
    function update_previously_searched_cache(username) {
        const localStorageData = localStorage.getItem('previously_searched_profiles');
        let updated_searched_cache = [];

        if (localStorageData !== null) {
            const retrievedArray = JSON.parse(localStorageData);
            localStorage.removeItem('previously_searched_profiles');

            const retrivedSet = new Set(retrievedArray);
            retrivedSet.add(username);

            updated_searched_cache = Array.from(retrivedSet);
        } else {
            updated_searched_cache.push(username);
        }

        updated_searched_cache.sort();
        localStorage.setItem("previously_searched_profiles", JSON.stringify(updated_searched_cache));
    }
    //#endregion

    return (
        <>
            <Header />
            <div id='profile_container'>
                <div className='profile_dashboard'>
                    <UserProfileDashboard user_name={requested_username} bio={requested_user_bio} profile_photo={requested_user_photo} />
                </div>
                <div id='rest_of_profile'>
                    <DisplayAllPosts user_name={requested_username} />
                </div>
            </div>
        </>
    );
}

export default Profile;
