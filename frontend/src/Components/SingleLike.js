import React, { useState, useEffect } from "react";
import '../CSS for Components/SingleLike.css';
import default_user_logo from '../Images/Default User Logo 2.jpg';

function SingleLike(props) {
    //#region Global declarations
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [dp, set_dp] = useState(default_user_logo);
    let url = "http://localhost:3000/profile/" + props.username;
    //#endregion

    //#region Get profile photo
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
            if (dataa.profile_photo !== "NULL") set_dp("data:image/jpeg;base64," + dataa.profile_photo)
        } catch {
            console.log("Internal server error");
        }
    }

    useEffect(() => {
        get_profile_photo(props.username);
    }, [props.username]);
    //#endregion

    return (
        <>
            <div className="a_single_like">
                <div className="like_header">
                    <a href={url} target='_blank' rel="noreferrer">
                        <div className="like_creator_dp">
                            <img src={dp} alt="" />
                        </div>
                    </a>
                    <a href={url} className="link_clear" target='_blank' rel="noreferrer">
                        <p className="like_creator_name">@{(props.username === user_login_info_from_cache.user_name) ? "You" : props.username}</p>
                    </a>
                </div>
            </div>
        </>
    );
}

export default SingleLike;
