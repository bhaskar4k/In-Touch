import React, { useState, useEffect } from "react";
import '../CSS for Components/PostModal.css';
import default_user_logo from '../Images/Default User Logo 2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CommentBox from '../Components/CommentBox';
import LikeBox from '../Components/LikeBox';
import { faHeart, faCommentDots, faPaperPlane, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { io } from 'socket.io-client';

const socket = io.connect("http://localhost:4000");

function PostModal(props) {
    //#region Global declarations
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    let post_photo_container = "post_photo_container" + props.post_id;
    let post_photo = "post_photo" + props.post_id;
    let profile_photo = props.profile_photo;
    const [color, set_color] = useState("white");
    const [like_count, set_like_count] = useState(0);
    const [view_comment, set_view_comment] = useState(false);
    const [view_like, set_view_like] = useState(false);
    const [view_post_desc, set_view_post_desc] = useState(true);
    const [rows, setRows] = useState(3);
    const [value, setValue] = useState(props.post_desc);
    const [post_description, set_post_description] = useState(props.post_desc);
    let comment_input_field_id = "comment_input_field_id" + props.post_id;
    let post_modify_id = "post_modify" + props.post_id;
    let post_edit_id = "post_edit_id" + props.post_id;
    let edit_post_button_id = "edit_post_button_id" + props.post_id;
    let edit_post_button_submit_id = "edit_post_button_submit_id" + props.post_id;
    let url = "http://localhost:3000/profile/" + props.uploader_username;
    //#endregion


    //#region Useeffect
    useEffect(() => {
        function auto_adjust_height_or_width() {
            var img = document.getElementById(post_photo);
            let width = img.naturalWidth, height = img.naturalHeight

            if (width > height) {
                document.getElementById(post_photo_container).style.width = "610px";
                document.getElementById(post_photo).style.width = "600px";
                document.getElementById(post_photo).style.border = "4px solid rgb(0, 145, 255)";
            } else {
                document.getElementById(post_photo_container).style.height = "410px";
                document.getElementById(post_photo_container).style.width = "610px";
                document.getElementById(post_photo_container).style.borderRadius = "10px";
                document.getElementById(post_photo_container).style.border = "4px solid rgb(0, 145, 255)";
                document.getElementById(post_photo_container).style.backgroundImage = "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)";
                document.getElementById(post_photo).style.height = "400px";
                document.getElementById(post_photo).style.margin = "0 auto";
            }

            document.getElementById(post_photo).style.display = "block";
        }

        if (props.post_photo !== null) auto_adjust_height_or_width();

        is_this_post_liked_by_loggedin_user();

        async function is_this_post_liked_by_loggedin_user() {
            try {
                const response = await fetch("http://localhost:4000/api/is_liked/" + props.post_id + "/" + user_login_info_from_cache.user_name, { method: 'GET' });
                const res = await response.json();

                if (response.status === 200) {
                    if (res.message === "true") {
                        set_color("rgb(0, 145, 255)")
                    } else {
                        set_color("white")
                    }
                }
            } catch {
                console.log("error")
            }
        }
    }, []);
    //#endregion


    //#region Get newest like from socket
    useEffect(() => {
        const handle_like = (newLike) => {
            if (newLike === undefined || newLike === null) return;
            if (newLike.post_id === props.post_id) {
                if (newLike.is_liked === true) {
                    if (newLike.username === user_login_info_from_cache.user_name) {
                        set_color("rgb(0, 145, 255)")
                    }
                } else {
                    if (newLike.username === user_login_info_from_cache.user_name) {
                        set_color("white")
                    }
                }
                set_like_count(newLike.count)
            }
        };

        socket.on('receive_like', handle_like);

        return () => {
            socket.off('receive_like', handle_like);
        };
    }, [socket]);
    //#endregion


    //#region Like control
    async function like_control() {
        const info = {
            post_id: props.post_id,
            username: user_login_info_from_cache.user_name
        }
        try {
            let response = await fetch("http://localhost:4000/api/like_control", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            })

            if (response.status === 200) {
                let like = await response.json();
                socket.emit('send_like', like);
                socket.emit('send_push_like', like);
            }
        } catch {
            console.log("error")
        }
    }
    //#endregion


    //#region Get like count
    async function get_like_count() {
        try {
            const response = await fetch("http://localhost:4000/api/get_like_count/" + props.post_id, { method: 'GET' });
            const count = await response.json();
            set_like_count(count.count);
        } catch {
            console.log("error");
        }
    }

    useEffect(() => {
        get_like_count();
    }, []);

    //#endregion


    //#region Do comment
    async function do_comment() {
        let comment_text = document.getElementById(comment_input_field_id).value;

        if (comment_text === '' || comment_text === "") return;

        var currentdate = new Date();
        var date = currentdate.getDate() + "." + (currentdate.getMonth() + 1) + "." + currentdate.getFullYear();
        var time = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        let comment = {
            "comment_id": "comment," + props.post_id + "," + user_login_info_from_cache.user_name + "," + date + "," + time,
            "post_id": props.post_id,
            "username": user_login_info_from_cache.user_name,
            "comment_description": comment_text,
            "upload_date": date,
            "upload_time": time
        }

        try {
            let response = await fetch("http://localhost:4000/api/do_comment", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comment)
            })

            if (response.status === 200) {
                document.getElementById(comment_input_field_id).value = "";
                let cmnt = await response.json();
                socket.emit('send_comment', cmnt);
                socket.emit('send_push_comment', cmnt);
            }
        } catch {
            console.log("error")
        }
    }
    //#endregion


    //#region Display comment and like box
    function show_comment_box() {
        if (view_comment === false) {
            set_view_like(false);
            set_view_comment(true);
        } else {
            set_view_comment(false);
        }
    }

    function show_like_box() {
        if (view_like === false) {
            set_view_comment(false);
            set_view_like(true);
        } else {
            set_view_like(false);
        }
    }
    //#endregion


    //#region Open close post modification area
    function open_close_post_modification_area() {
        if (document.getElementById(post_modify_id).style.height === "0px") {
            document.getElementById(post_modify_id).style.height = "60px";
        } else {
            document.getElementById(post_modify_id).style.height = "0px";
        }
    }
    //#endregion


    //#region Handling height of post edit input area
    const handleChange = (event) => {
        let str = event.target.value;
        let count = str.length;
        let newRows = parseInt(count / 70) + 1;

        if (parseInt(count / 70) < 3) newRows = 3;

        setRows(newRows);
        setValue(str);
    };
    //#endregion


    //#region Open close post edit area
    function do_edit() {
        if (view_post_desc === true) {
            set_view_post_desc(false);
            document.getElementById(edit_post_button_id).innerHTML = "Discard";
        } else {
            set_view_post_desc(true);
            document.getElementById(edit_post_button_id).innerHTML = "Edit post";
        }

        if (document.getElementById(post_modify_id).style.height === "0px") {
            document.getElementById(post_modify_id).style.height = "60px";
        } else {
            document.getElementById(post_modify_id).style.height = "0px";
        }
    }
    //#endregion


    //#region Update editted post in DB
    async function update_editted_post() {
        let updated_post = {
            username: user_login_info_from_cache.user_name,
            post_id: props.post_id,
            updated_post_description: value,
            tags: get_all_tags(value)
        }

        try {
            let response = await fetch("http://localhost:4000/api/update_post", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updated_post)
            })

            if (response.status === 200) {
                set_post_description(value);
                document.getElementById(edit_post_button_id).innerHTML = "Edit post";
                set_view_post_desc(true);
            }
        } catch {
            console.log("error")
        }
    }


    function get_all_tags(post_text) {
        let tag_arr = [];
        let i = 0;
        while (i < post_text.length) {
            if (post_text[i] === '#') {
                let cur_tag = "";
                let j = i + 1;
                for (j = i + 1; j < post_text.length; j++) {
                    if (post_text[j] === ' ' || post_text[j] === '#') {
                        if (cur_tag !== "") tag_arr.push(cur_tag);
                        cur_tag = "";
                        break;
                    }
                    cur_tag += post_text[j];
                }
                if (cur_tag !== "") tag_arr.push(cur_tag);
                i = j;
            } else {
                i++;
            }
        }

        return tag_arr;
    }


    useEffect(() => {
        if (document.getElementById(edit_post_button_submit_id)) {
            if (value !== '') {
                document.getElementById(edit_post_button_submit_id).disabled = false;
            } else {
                document.getElementById(edit_post_button_submit_id).disabled = true;
            }
        }
    }, [value])
    //#endregion


    //#region Delete post
    async function delete_post() {
        let deleted_post = {
            post_id: props.post_id,
        }

        try {
            let response = await fetch("http://localhost:4000/api/delete_post", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deleted_post)
            })

            if (response.status === 200) {
                window.location.reload();
            }
        } catch {
            console.log("error")
        }
    }
    //#endregion

    return (
        <>
            <div className="post_container">
                {user_login_info_from_cache.user_name === props.uploader_username && <div className="post_info_more">
                    <FontAwesomeIcon icon={faEllipsisVertical} onClick={open_close_post_modification_area} />
                </div>}

                <div id={post_modify_id} style={{ height: '0px' }} className="post_modify">
                    <button id={edit_post_button_id} className="edit_post" onClick={do_edit}>Edit post</button>
                    <button className="delete_post" onClick={delete_post}>Delete post</button>
                </div>

                <div className="post_heading_info">
                    <a href={url} target='_blank' rel="noreferrer">
                        <div className="post_owner_photo">
                            <img src={profile_photo} alt="" />
                        </div>
                    </a>
                    <div className="post_header">
                        <p className="post_owner_name"><a href={url} className="link_clear_of_post" target='_blank' rel="noreferrer">@{props.uploader_username}</a></p>
                        <p className="post_uploaded_time">{props.upload_time}</p>
                    </div>
                </div>

                {view_post_desc && <p className="post_description">{post_description}</p>}

                {!view_post_desc && user_login_info_from_cache.user_name === props.uploader_username &&
                    <textarea type="text" id={post_edit_id} value={value} onChange={handleChange} className="post_edit_input" rows={rows}></textarea>}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div></div>
                    {!view_post_desc && user_login_info_from_cache.user_name === props.uploader_username &&
                        <button className="submit_editted_post" id={edit_post_button_submit_id} onClick={update_editted_post}>Edit</button>}
                </div>

                <div className="post_photo_container" id={post_photo_container}>
                    <img src={props.post_photo} id={post_photo} alt="" />
                </div>

                <div className="engagement">
                    <div className="like_comment_box_div">
                        <div className="like">
                            <FontAwesomeIcon icon={faHeart} style={{ color: color, cursor: 'pointer' }} onClick={like_control} />
                            <p className="like_count" onClick={show_like_box}>{like_count} Like</p>
                        </div>
                        <div className="view_comment">
                            <FontAwesomeIcon icon={faCommentDots} onClick={show_comment_box} />
                        </div>
                    </div>
                    <div className="comment">
                        <input type="text" id={comment_input_field_id} />
                        <div className="do_comment">
                            <FontAwesomeIcon icon={faPaperPlane} onClick={do_comment} />
                        </div>
                    </div>
                </div>

                {view_comment && <CommentBox post_id={props.post_id} loggedin_user_profile_photo={profile_photo} />}
                {view_like && <LikeBox post_id={props.post_id} loggedin_user_profile_photo={profile_photo} />}
            </div>
        </>
    );
}

export default PostModal;
