import React, { useState, useEffect, useRef } from "react";
import PostModal from '../Components/PostModal'
import LoadingPopup from '../Components/LoadingPopup';
import PostRenderingAnimation from '../Components/PostRenderingAnimation';
import '../CSS for Components/DisplayAllPosts.css';
import default_user_logo from '../Images/Default User Logo 2.jpg';

let offset = 0;

function DisplayAllPosts(props) {
    //#region Global declarations
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [render_all_posts, set_render_all_posts] = useState(null);
    const [render_loading_popup, set_render_loading_popup] = useState(null);
    const [all_post_array, set_all_post_array] = useState([]);
    const [display_load_more_post_button, set_display_load_more_post_button] = useState(false);

    let requested_user_photo = default_user_logo;
    //#endregion

    //#region Get profile photo from database
    async function get_profile_photo() {
        let dataa = {
            user_name: props.user_name,
            profile_photo: "NULL"
        };
        try {
            let response = await fetch('http://localhost:8080/get_profile_photo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: props.user_name
            })

            dataa = await response.json();
            if (dataa.profile_photo !== "NULL") requested_user_photo = "data:image/jpeg;base64," + dataa.profile_photo;
        } catch {
            console.log("Internal server error");
        }
    }
    //#endregion

    //#region Get all posts from DB
    async function get_all_posts(loader_text) {
        try {
            set_render_loading_popup(<PostRenderingAnimation text={loader_text} />);
            const response = await fetch("http://localhost:4000/api/get_all_post/" + props.user_name + "/" + offset, { method: 'GET' });
            const posts = await response.json();

            let new_post = []
            for (let i = 0; i < posts.length; i++) {
                new_post.push(<PostModal
                    post_id={posts[i].post_id}
                    uploader_username={posts[i].username}
                    upload_time={posts[i].upload_date + " " + posts[i].upload_time}
                    post_desc={posts[i].post_description}
                    post_photo={posts[i].post_image}
                    profile_photo={requested_user_photo} />)
            }

            let temp = all_post_array.concat(new_post);
            set_all_post_array(temp)
            set_render_all_posts(temp)
            if (new_post.length >= 10) {
                set_display_load_more_post_button(true);
            } else {
                set_display_load_more_post_button(false);
            }

            setTimeout(() => {
                set_render_loading_popup(null);
            }, 500);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }
    //#endregion


    useEffect(() => {
        get_profile_photo();
        get_all_posts("Fetching posts...");
    }, []);


    function render_more_posts() {
        offset += 10;
        get_profile_photo();
        get_all_posts("Fetching more posts...");
    }

    return (
        <>
            <div id="all_posts">
                {render_all_posts}
                {render_loading_popup}
                {display_load_more_post_button && <button onClick={render_more_posts} id="show_more_post_button">Load more</button>}
            </div>
        </>
    );
}

export default DisplayAllPosts;
