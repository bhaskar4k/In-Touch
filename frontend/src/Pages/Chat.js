import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderForChat from '../Components/HeaderForChat';
import SingleChattingUser from '../Components/SingleChattingUser';
import Chatbox from '../Components/Chatbox';
import '../CSS for Components/Chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

function Chat() {
    // #region Global declarations
    document.title = '1v1 Chat';
    const navigate = useNavigate();
    const [loggedin_person_user_name, set_loggedin_person_user_name] = useState(null);
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [chatting_user_list, set_chatting_user_list] = useState([]);
    const [selected_chat_id, set_selected_chat_id] = useState(null);
    const [selected_chat_username, set_selected_chat_username] = useState(null);
    const [chatbox, set_chatbox] = useState(null);

    let selected_chat_id_from_url = null, selected_chat_username_from_url = null;
    // #endregion


    // #region Useeffect
    useEffect(() => {
        if (user_login_info_from_cache !== null) {
            set_loggedin_person_user_name(user_login_info_from_cache.user_name);
            let screen_height = window.innerHeight;
            document.getElementById("chat_parent").style.height = "" + (screen_height - 70) + "px";

            fetch_username_for_new_chat();
            fetch_all_chatting_user_list();
        } else {
            navigate(`/home`);
        }
    }, []);
    // #endregion


    //#region Fetch username from URL for new chat
    function fetch_username_for_new_chat() {
        const page_url = window.location.href;
        let chatting_person = "";
        for (let i = 27; i < page_url.length; i++) {
            chatting_person += page_url[i];
        }

        if (chatting_person !== "") {
            is_it_a_valid_profile(chatting_person);
            insert_new_chat_person_into_DB(chatting_person);
        }
    }
    //#endregion


    //#region Is it a valid profile?
    async function is_it_a_valid_profile(chatting_person) {
        try {
            let response = await fetch('http://localhost:8080/is_it_a_valid_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: chatting_person
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


    //#region Insert new chat person into DB
    async function insert_new_chat_person_into_DB(chatting_person) {
        let new_chat_entry = {
            person1: chatting_person,
            person2: user_login_info_from_cache.user_name
        }

        try {
            const response = await fetch('http://localhost:8080/insert_new_chat_person_into_db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(new_chat_entry)
            });

            const server_response = await response.text();

            if (server_response !== "ok" && server_response !== "fail") {
                selected_chat_id_from_url = parseInt(server_response);
                selected_chat_username_from_url = chatting_person;
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    //#endregion


    //#region Fetch all chatting user list
    async function fetch_all_chatting_user_list() {
        try {
            const response = await fetch('http://localhost:8080/all_chatting_user_list?loggedin_person_user_name='
                + user_login_info_from_cache.user_name, { method: 'GET' }
            );

            const jsonResponse = await response.json();
            let all_list = [];

            jsonResponse.forEach(obj => {
                all_list.push(
                    <SingleChattingUser key={obj.chat_id} chat_id={obj.chat_id} username={obj.username} onSelectChat={render_select_chatbox} />
                )
            });

            set_chatting_user_list(all_list);

            if (selected_chat_id_from_url !== null) {
                set_selected_chat_id(selected_chat_id_from_url);
                set_selected_chat_username(selected_chat_username_from_url);
            }
        } catch (error) {
            console.log("Internal server error");
        }
    }

    function render_select_chatbox(chat_id, username) {
        set_selected_chat_id(null);
        setTimeout(() => {
            set_selected_chat_id(chat_id);
            set_selected_chat_username(username);
        }, 10);
    }
    //#endregion


    //#region Close right side chatbox
    function close_right_side_chatbox() {
        set_selected_chat_id(null);
        set_selected_chat_username(null);
    }
    //#endregion

    return (
        <>
            <HeaderForChat />
            <div id='chat_parent'>
                <div id="user_list">
                    {chatting_user_list}
                </div>
                <div id="chat_box">
                    {selected_chat_id && <Chatbox chat_id={selected_chat_id} username={selected_chat_username} offset={0} />}
                </div>
                {selected_chat_id && <FontAwesomeIcon icon={faXmark} className='close_chat' onClick={close_right_side_chatbox} />}
            </div>
        </>
    );
}

export default Chat;
