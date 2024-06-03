import React, { useState, useEffect } from "react";
import '../CSS for Components/FollowerList.css';
import DisplaySingleUser from '../Components/DisplaySingleUser';

let offset = 0;

function FollowerList(props) {
    //#region Global declarations
    //const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [follower_list, set_follower_list] = useState([]);
    const [show_load_more_follower_button, set_show_load_more_follower_button] = useState(false);
    //#endregion


    //#region Get following list
    async function get_follower_list() {
        try {
            const response = await fetch("http://localhost:4000/api/get_follower_list/" + props.username + "/" + offset, { method: 'GET' });
            const all_follower_list = await response.json();

            let new_follower_list = [];
            for (let i = 0; i < all_follower_list.length; i++) {
                new_follower_list.push(
                    <DisplaySingleUser
                        username={all_follower_list[i].followed_by_username}
                    />
                )
            }

            set_follower_list([...follower_list, new_follower_list]);

            if (new_follower_list.length >= 10) {
                set_show_load_more_follower_button(true);
            } else {
                set_show_load_more_follower_button(false);
            }
        } catch {
            console.log("error");
        }
    }

    useEffect(() => {
        offset = 0;
        get_follower_list();
    }, []);

    function load_more_follower() {
        offset += 10;
        get_follower_list();
    }
    //#endregion


    return (
        <>
            <div id="follower_box_container">
                <div id="follower_box">{follower_list}</div>

                {show_load_more_follower_button &&
                    <button className="load_more_follower_btn" onClick={load_more_follower}>Load more...</button>}

                {!show_load_more_follower_button &&
                    <p className="no_more_follower">No more follower...</p>}
            </div>
        </>
    );
}

export default FollowerList;
