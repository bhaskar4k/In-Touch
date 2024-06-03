import '../CSS for Components/Chatbox.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import default_user_logo from '../Images/Default User Logo 2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import SingleMessage from '../Components/SingleMessage';
import { io } from 'socket.io-client';
import { useRef } from 'react';

const socket = io.connect("http://localhost:4000");
function Chatbox(props) {
    // #region Global declarations
    document.title = '1v1 Chat';
    const navigate = useNavigate();
    const ref = useRef(null);
    const [loggedin_person_user_name, set_loggedin_person_user_name] = useState(null);
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [dp, set_dp] = useState(default_user_logo);
    let url = "http://localhost:3000/profile/" + props.username;
    const [all_chat_list, set_all_chat_list] = useState([]);
    const [offset, set_offset] = useState(0);
    const [load_more_message, set_load_more_message] = useState(true);
    const [is_not_end_of_message, set_is_not_end_of_message] = useState(true);
    let size = 1;
    // #endregion


    //#region Get profile photo of chatting user
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


    //#region Pull past chat
    async function pull_past_chat() {
        console.log("offset", offset)
        let entity = {
            chat_id: props.chat_id,
            offset: offset
        };

        try {
            let response = await fetch('http://localhost:8080/pull_past_chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entity)
            })

            let data = await response.json();
            data.reverse();

            let all_list = [];
            data.forEach(obj => {
                let entity = null;
                if (user_login_info_from_cache.user_name === obj.sent_by) {
                    entity = <SingleMessage index={size} chat_id={obj.chat_id}
                        message={obj.message} sent_time={obj.sent_time}
                        bg_color={"#0077ff"} margin_left={"345px"}
                    />
                } else {
                    entity = <SingleMessage index={size} chat_id={obj.chat_id}
                        message={obj.message} sent_time={obj.sent_time}
                        bg_color={"#228c01"} margin_left={"0px"} />
                }

                size++;
                all_list.push(entity);
            });

            if (data.length < 20) {
                set_is_not_end_of_message(false);
                document.getElementById("scrollable_chatbox").style.marginTop = "0px";
            }
            set_all_chat_list([...all_list, all_chat_list]);
            set_offset(offset + 20);
        } catch (ex) {
            console.log(ex);
        }
    }
    //#endregion


    // #region Useeffect
    useEffect(() => {
        if (user_login_info_from_cache !== null) {
            set_loggedin_person_user_name(user_login_info_from_cache.user_name);
            let parent_height = document.getElementById("personal_chat_parent").offsetHeight;
            document.getElementById("personal_chat_box").style.height = "" + (parent_height - 164) + "px";

            set_load_more_message(false);
            pull_past_chat();
            set_load_more_message(true);
        } else {
            navigate(`/home`);
        }
    }, []);
    // #endregion


    // #region Send message
    async function send_message() {
        let message = document.getElementById("msg_input").value;
        if (message === "" || message === null || message === undefined) return;

        let chat_id = props.chat_id;
        var currentdate = new Date();
        var date = currentdate.getDate() + "." + (currentdate.getMonth() + 1) + "." + currentdate.getFullYear();
        var time = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        let sent_time = date + " " + time;

        let message_entity = {
            chat_id: chat_id,
            sent_by: user_login_info_from_cache.user_name,
            message: message,
            sent_time: sent_time
        }

        try {
            let response = await fetch('http://localhost:8080/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message_entity)
            })

            let data = await response.text();

            if (data === "ok") {
                socket.emit('new_message', message_entity);
                document.getElementById("msg_input").value = "";
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    //#endregion


    //#region Get newest message from socket
    useEffect(() => {
        const handle_like = (message_entity) => {
            if (message_entity === undefined || message_entity === null) return;

            if (message_entity.chat_id === props.chat_id) {
                let entity = null;

                if (user_login_info_from_cache.user_name === message_entity.sent_by) {
                    entity = <SingleMessage index={size} chat_id={message_entity.chat_id}
                        message={message_entity.message} sent_time={message_entity.sent_time}
                        bg_color={"#0077ff"} margin_left={"345px"}
                    />;
                } else {
                    entity = <SingleMessage index={size} chat_id={message_entity.chat_id}
                        message={message_entity.message} sent_time={message_entity.sent_time}
                        bg_color={"#228c01"} margin_left={"0px"}
                    />;
                }

                set_all_chat_list(all_chat_list => [...all_chat_list, entity]);
                size++;
            }
        };

        socket.on('receive_new_message', handle_like);

        return () => {
            socket.off('receive_new_message', handle_like);
        };
    }, [socket]);
    //#endregion

    return (
        <>
            <div id='personal_chat_parent'>
                <div className='personal_chat_person'>
                    <div className="chat_header">
                        <a href={url} target='_blank' rel="noreferrer">
                            <div className="chat_creator_dp">
                                <img src={dp} alt="" />
                            </div>
                        </a>
                        <a href={url} className="link_clear" target='_blank' rel="noreferrer">
                            <p className="chat_creator_name">@{props.username}</p>
                        </a>
                    </div>
                </div>

                <div id='personal_chat_box'>
                    {is_not_end_of_message && load_more_message && <FontAwesomeIcon icon={faSpinner} className='load_more_msg' onClick={pull_past_chat} />}
                    {is_not_end_of_message && !load_more_message && <FontAwesomeIcon icon={faSpinner} className='load_more_msg_spinner' />}
                    <div ref={ref} id='scrollable_chatbox'>
                        {all_chat_list}
                    </div>
                </div>

                <div className='personal_chat_msg_send_area'>
                    <input id='msg_input'></input>
                    <FontAwesomeIcon icon={faPaperPlane} className='msg_send_btn' onClick={send_message} />
                </div>
            </div>
        </>
    );
}

export default Chatbox;
