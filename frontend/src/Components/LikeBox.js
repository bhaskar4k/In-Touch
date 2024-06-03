import React, { useState, useEffect } from "react";
import '../CSS for Components/LikeBox.css';
import SingleLike from '../Components/SingleLike';
import default_user_logo from '../Images/Default User Logo 2.jpg';
import { io } from 'socket.io-client';

const socket = io.connect("http://localhost:4000");
let offset = 0;
let arr = [];

function LikeBox(props) {
    //#region Global declarations
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [like, set_like] = useState([]);
    const [show_load_more_like_button, set_show_load_more_like_button] = useState(false);
    //#endregion


    //#region Get newest like from socket
    useEffect(() => {
        const handle_like = (newSinglelike) => {
            if (newSinglelike === undefined || newSinglelike === null) return;

            if (newSinglelike.post_id === props.post_id) {
                if (newSinglelike.is_liked === true) {
                    let newLike = [
                        <SingleLike
                            post_id={newSinglelike.post_id}
                            username={newSinglelike.username}
                        />
                    ];

                    set_like(like => [newLike, ...like]);
                } else {
                    offset = 0;
                    get_like(false);
                }
            }
        };

        socket.on('receive_like', handle_like);

        return () => {
            socket.off('receive_like', handle_like);
        };
    }, [props.post_id, like, socket]);
    //#endregion


    //#region Get Like
    async function get_like(ok) {
        try {
            const response = await fetch("http://localhost:4000/api/get_all_like_list/" + props.post_id + "/" + offset, { method: 'GET' });
            const all_like = await response.json();

            let new_like = [];
            for (let i = 0; i < all_like.length; i++) {
                new_like.push(
                    <SingleLike
                        post_id={all_like[i].post_id}
                        username={all_like[i].username}
                    />
                )
            }

            if (ok) {
                set_like([...like, new_like]);
            } else {
                set_like([...new_like]);
            }

            if (new_like.length >= 10) {
                set_show_load_more_like_button(true);
            } else {
                set_show_load_more_like_button(false);
            }
        } catch {
            console.log("error");
        }
    }

    useEffect(() => {
        offset = 0;
        get_like(true);
    }, []);

    function load_more_like() {
        offset += 10;
        get_like(true);
    }
    //#endregion


    return (
        <>
            <div id="like_box_container">
                <div id="like_box">{like}</div>

                {show_load_more_like_button &&
                    <button className="load_more_like_btn" onClick={load_more_like}>Load more...</button>}

                {!show_load_more_like_button &&
                    <p className="no_more_likes">No more likes...</p>}
            </div>
        </>
    );
}

export default LikeBox;
