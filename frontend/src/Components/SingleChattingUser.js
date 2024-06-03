import React, { useState, useEffect } from "react";
import '../CSS for Components/SingleLike.css';
import default_user_logo from '../Images/Default User Logo 2.jpg';
import '../CSS for Components/SingleChattingUser.css';

function SingleChattingUser(props) {
    //#region Global declarations
    const [dp, set_dp] = useState(default_user_logo);
    //#endregion


    //#region Get profile_photo
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
    //#endregion


    //#region UseEffect
    useEffect(() => {
        get_profile_photo(props.username);
    }, [props.username]);
    //#endregion


    return (
        <>
            <div className="a_single_chat" onClick={() => props.onSelectChat(props.chat_id, props.username)}>
                <div className="chat_header">
                    <div className="chat_creator_dp">
                        <img src={dp} alt="" />
                    </div>
                    <p className="chat_creator_name">@{props.username}</p>
                </div>
            </div>
        </>
    );
}

export default SingleChattingUser;
