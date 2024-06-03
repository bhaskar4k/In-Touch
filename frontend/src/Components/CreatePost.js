import React from 'react';
import { useState } from 'react';
import Popup from './Popup';

import '../CSS for Components/CreatePost.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons'

function CreatePost() {
    //#region Global declarations
    const [uploaded_image_url, set_uploaded_image_url] = useState(null);
    const [uploaded_image_url_base64, set_uploaded_image_url_base64] = useState(null);
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [has_image, set_has_image] = useState(false);
    const [value, setValue] = useState('');
    const [rows, setRows] = useState(6);
    const [showPopup, setShowPopup] = useState(false);
    const [popup_message, set_popup_message] = useState("");
    const [popup_type, set_popup_type] = useState("");
    const [height, set_height] = useState("auto");
    const [width, set_width] = useState("auto");
    //#endregion


    //#region Display uploaded image
    const render_uploaded_image = (event) => {
        const file = event.target.files[0];
        convert_to_base_64(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                set_uploaded_image_url(e.target.result);
            };
            reader.readAsDataURL(file);

            if (has_image === false) {
                let parent_div = document.getElementById("create_post_div").style.height;
                let parent_div_height = parseInt(parent_div.substring(0, parent_div.length - 2));
                document.getElementById("create_post_div").style.height = "" + (parent_div_height + 200) + "px";

                let child_div = document.getElementById("create_post_container").style.height;
                let child_div_height = parseInt(child_div.substring(0, child_div.length - 2));
                document.getElementById("create_post_container").style.height = "" + (child_div_height + 200) + "px";

                set_has_image(true);
            }

            getImageDimensions(file)
                .then(dimensions => {
                    let width = dimensions.width;
                    let height = dimensions.height;

                    if (width > height) {
                        set_width("100%");
                        set_height("auto");
                    } else {
                        set_height("100%");
                        set_width("auto");
                    }
                })
        }
    }

    function getImageDimensions(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                resolve({ width: this.width, height: this.height });
            };
            img.src = URL.createObjectURL(file);
        });
    }
    //#endregion


    //#region Unselect image
    function unselect_image() {
        set_uploaded_image_url(null);
        set_uploaded_image_url_base64(null);

        let parent_div = document.getElementById("create_post_div").style.height;
        let parent_div_height = parseInt(parent_div.substring(0, parent_div.length - 2));
        document.getElementById("create_post_div").style.height = "" + (parent_div_height - 200) + "px";

        let child_div = document.getElementById("create_post_container").style.height;
        let child_div_height = parseInt(child_div.substring(0, child_div.length - 2));
        document.getElementById("create_post_container").style.height = "" + (child_div_height - 200) + "px";

        set_has_image(false);
    }
    //#endregion


    //#region handling height of this div
    const handleChange = (event) => {
        let str = event.target.value;
        let count = str.length;
        let newRows = parseInt(count / 38) + 1;

        if (parseInt(count / 38) < 6) newRows = 6;

        let parent_div = document.getElementById("create_post_div").style.height;
        let parent_div_height = parseInt(parent_div.substring(0, parent_div.length - 2));
        let child_div = document.getElementById("create_post_container").style.height;
        let child_div_height = parseInt(child_div.substring(0, child_div.length - 2));

        if (newRows > rows) {
            document.getElementById("create_post_div").style.height = "" + (parent_div_height + 35) + "px";
            document.getElementById("create_post_container").style.height = "" + (child_div_height + 35) + "px";
        } else if (newRows < rows) {
            document.getElementById("create_post_div").style.height = "" + (parent_div_height - 35) + "px";
            document.getElementById("create_post_container").style.height = "" + (child_div_height - 35) + "px";
        }

        setRows(newRows);
        setValue(str);
    };
    //#endregion


    //#region Make post
    async function make_post() {
        let post_text = document.getElementById("post_text").value;
        const file = document.getElementById('uploaded_image_for_post');

        if ((post_text === "" || post_text === null) && (file === null || file === undefined)) {
            openPopup("Post is empty", "2");
            return;
        }

        var currentdate = new Date();
        var date = currentdate.getDate() + "." + (currentdate.getMonth() + 1) + "." + currentdate.getFullYear();
        var time = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        let post_count = 0;

        try {
            let response = await fetch('http://localhost:8080/get_post_count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: user_login_info_from_cache.user_name
            })

            const server_response = await response.text();
            post_count = parseInt(server_response) + 1;
        } catch {
            console.log("Internal server error");
        }

        let post_desc = {
            "post_id": "post|" + user_login_info_from_cache.user_name + "|" + post_count,
            "username": user_login_info_from_cache.user_name,
            "post_description": post_text,
            "post_image": uploaded_image_url_base64,
            "tag": get_all_tags(post_text),
            "upload_date": date,
            "upload_time": time
        }

        api_call_to_make_post(post_desc)
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

    function convert_to_base_64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            set_uploaded_image_url_base64(reader.result)
        }
        reader.onerror = error => {
            console.log(error)
        }
    }

    async function api_call_to_make_post(post_desc) {
        try {
            let response = await fetch("http://localhost:4000/api/add_post", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post_desc)
            })

            if (response.status === 200) {
                try {
                    const response = await fetch('http://localhost:8080/update_post_count', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: user_login_info_from_cache.user_name
                    })

                    const server_response = await response.text();

                    let status = server_response[0];
                    if (status === "2") {
                        delete_post(post_desc.post_id);
                    } else {
                        localStorage.removeItem("touch__user_login_info");

                        user_login_info_from_cache.post_count++;
                        localStorage.setItem("touch__user_login_info", JSON.stringify(user_login_info_from_cache));

                        window.location.reload();
                    }
                } catch {
                    delete_post(post_desc.post_id);
                    console.log("Internal server error");
                }
            }
        } catch {
            console.log("Error");
        }
    }

    async function delete_post(postid) {
        let info = {
            post_id: postid
        }
        try {
            await fetch("http://localhost:4000/api/delete_post", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            })
        } catch (error) {
            console.log(error)
        }
    }
    //#endregion


    //#region POPUP
    // Popup open
    const openPopup = (message, type) => {
        set_popup_message(message);
        set_popup_type(type);
        setShowPopup(true);
    };

    // Popup close
    const closePopup = () => {
        set_popup_message("");
        set_popup_type("");
        setShowPopup(false);
    };
    //#endregion

    return (
        <>
            {showPopup && <Popup onClose={closePopup} message={popup_message} type={popup_type} />}

            <div id='create_post_container' style={{ height: '320px' }}>
                <textarea id='post_text' placeholder='Share........' value={value} onChange={handleChange} rows={rows}></textarea>

                {uploaded_image_url && <div className='uploaded_image_for_post'>
                    <div className='unselect_image' onClick={unselect_image}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                    <img src={uploaded_image_url} alt="" id="uploaded_image_for_post" style={{ width, height }}></img>
                </div>}


                <div className="photo_upload_with_post">
                    <FontAwesomeIcon icon={faImage} />
                    <input type="file" accept="image/*" id="photo_upload_with_post" onChange={render_uploaded_image}></input>
                </div>

                <button className='upload_post_button' id='upload_post_button' onClick={make_post}>Post</button>
            </div>
        </>
    );
}

export default CreatePost