import React, { useState, useEffect } from "react";
import '../CSS for Components/CommentBox.css';
import SingleComment from '../Components/SingleComment';
import default_user_logo from '../Images/Default User Logo 2.jpg';
import { io } from 'socket.io-client';

const socket = io.connect("http://localhost:4000");
let offset = 0;

function CommentBox(props) {
    //#region Global declarations
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [comment, set_comment] = useState([]);
    const [show_load_more_comment_button, set_show_load_more_comment_button] = useState(false);
    //#endregion


    //#region Get newest comment from socket
    useEffect(() => {
        const handle_comment = (newComment) => {
            if (newComment.post_id === props.post_id) {
                const newSingleComment = (
                    <SingleComment
                        comment_id={newComment.comment_id}
                        post_id={newComment.post_id}
                        username={newComment.username}
                        comment_desc={newComment.comment_description}
                        upload_time={newComment.upload_date + " " + newComment.upload_time}
                    />
                );

                set_comment(comment => [newSingleComment, ...comment]);
            }
        };

        socket.on('receive_comment', handle_comment);

        return () => {
            socket.off('receive_comment', handle_comment);
        };
    }, [props.post_id]);
    //#endregion


    //#region Get comment
    async function get_comment() {
        try {
            const response = await fetch("http://localhost:4000/api/get_comment/" + props.post_id + "/" + offset, { method: 'GET' });
            const all_comment = await response.json();

            let new_cmnt = [];
            for (let i = 0; i < all_comment.length; i++) {
                new_cmnt.push(
                    <SingleComment
                        comment_id={all_comment[i].comment_id}
                        post_id={all_comment[i].post_id}
                        username={all_comment[i].username}
                        comment_desc={all_comment[i].comment_description}
                        upload_time={all_comment[i].upload_date + " " + all_comment[i].upload_time}
                    />
                )
            }

            set_comment([...comment, new_cmnt]);
            if (new_cmnt.length >= 10) {
                set_show_load_more_comment_button(true);
            } else {
                set_show_load_more_comment_button(false);
            }
        } catch {
            console.log("error");
        }
    }

    useEffect(() => {
        offset = 0;
        get_comment();
    }, []);

    function load_more_comment() {
        offset += 10;
        get_comment();
    }
    //#endregion


    return (
        <>
            <div id="comment_box_container">
                <div id="comment_box">{comment}</div>
                {show_load_more_comment_button &&
                    <button className="load_more_comment_btn" onClick={load_more_comment}>Load more...</button>}

                {!show_load_more_comment_button &&
                    <p className="no_more_comments">No more comments...</p>}
            </div>
        </>
    );
}

export default CommentBox;
