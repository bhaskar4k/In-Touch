import React, { useState, useEffect } from "react";
import '../CSS for Components/FollowingList.css';
import DisplaySingleUser from '../Components/DisplaySingleUser';

let offset = 0;

function FollowingList(props) {
    //#region Global declarations
    //const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [following_list, set_following_list] = useState([]);
    const [show_load_more_following_button, set_show_load_more_following_button] = useState(false);
    //#endregion


    //#region Get following list
    async function get_following_list() {
        try {
            const response = await fetch("http://localhost:4000/api/get_following_list/" + props.username + "/" + offset, { method: 'GET' });
            const all_following_list = await response.json();

            let new_following_list = [];
            for (let i = 0; i < all_following_list.length; i++) {
                new_following_list.push(
                    <DisplaySingleUser
                        username={all_following_list[i].username}
                    />
                )
            }

            set_following_list([...following_list, new_following_list]);

            if (new_following_list.length >= 10) {
                set_show_load_more_following_button(true);
            } else {
                set_show_load_more_following_button(false);
            }
        } catch {
            console.log("error");
        }
    }

    useEffect(() => {
        offset = 0;
        get_following_list();
    }, []);

    function load_more_following() {
        offset += 10;
        get_following_list();
    }
    //#endregion


    return (
        <>
            <div id="following_box_container">
                <div id="following_box">{following_list}</div>

                {show_load_more_following_button &&
                    <button className="load_more_following_btn" onClick={load_more_following}>Load more...</button>}

                {!show_load_more_following_button &&
                    <p className="no_more_following">No more following...</p>}
            </div>
        </>
    );
}

export default FollowingList;
