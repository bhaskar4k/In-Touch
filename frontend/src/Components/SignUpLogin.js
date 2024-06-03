import { React, useState } from "react";
import Popup from './Popup';
import { useEffect } from 'react';
import '../CSS for Components/SignUpLogin.css';
import { useNavigate } from 'react-router-dom';
import LoadingPopup from '../Components/LoadingPopup';

function SignUpLogin() {
    //#region Global declarations
    const navigate = useNavigate();
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const [showLoadingPopup, setShowLoadingPopup] = useState(false);
    //#endregion


    // #region Checking if session is active. If it's then navigate to feed
    useEffect(() => {
        if (user_login_info_from_cache !== null) {
            navigate(`/feed`);
        }
    }, []);
    //#endregion -----------------------------------------------------------------------------------------------------------------------------*/


    //#region Loading popup
    const openLoadingPopup = () => {
        setShowLoadingPopup(true);
        document.getElementById("signup_login_box_parent").style.opacity = "0.5";
        document.getElementById("signup_login_box_parent").style.backgroundColor = "black";
    };

    const closeLoadingPopup = () => {
        setShowLoadingPopup(false);
        document.getElementById("signup_login_box_parent").style.opacity = "1";
        document.getElementById("signup_login_box_parent").style.backgroundColor = "";
    };
    //#endregion


    //#region Notification popup
    const [showPopup, setShowPopup] = useState(false);
    const [popup_message, set_popup_message] = useState("");
    const [popup_type, set_popup_type] = useState("");

    const openPopup = (message, type) => {
        set_popup_message(message);
        set_popup_type(type);
        setShowPopup(true);
    };

    const closePopup = () => {
        set_popup_message("");
        set_popup_type("");
        setShowPopup(false);
    };
    //#endregion


    //#region Common control
    // Slider controller of SignUp/Login Form and the text beside it
    function slider() {
        if (document.getElementById("signup_login_type_name").style.left === "0px") {
            document.getElementById("signup_login_type_name").style.left = "600px";
            document.getElementById("form_container").style.left = "10px";
            document.getElementById("form_operation").innerHTML = 'login';

            setTimeout(function () {
                document.getElementById("text1").innerHTML = "Don't have account?";
                document.getElementById("slider_button").innerHTML = "Register now.";
                document.getElementById("heading_of_form").innerHTML = "Login";
                document.getElementById("signup_login_button").innerHTML = "Login";

                document.getElementById("slider_button").style.textAlign = "right";
                document.getElementById("text1").style.textAlign = "right";

                document.getElementById("underline1").style.marginLeft = "46px";
                document.getElementById("underline1").style.width = "220px";

                document.getElementById("form_container").style.height = "360px";

                document.getElementById("form_container").style.top = "150px";

                document.getElementsByClassName("main_form")[0].style.height = "200px";
                document.getElementsByClassName("main_form")[0].style.marginTop = "0px";

                var elems = document.getElementsByClassName("do_hide");
                for (var i = 0; i < elems.length; i += 1) {
                    elems[i].style.display = 'none';
                }
            }, 300);
        } else {
            document.getElementById("signup_login_type_name").style.left = "0px";
            document.getElementById("form_container").style.left = "400px";
            document.getElementById("form_operation").innerHTML = "signup";

            setTimeout(function () {
                document.getElementById("text1").innerHTML = "Already have account?";
                document.getElementById("slider_button").innerHTML = "Login now.";
                document.getElementById("heading_of_form").innerHTML = "SignUp";
                document.getElementById("signup_login_button").innerHTML = "Register";

                document.getElementById("slider_button").style.textAlign = "left";
                document.getElementById("text1").style.textAlign = "left";

                document.getElementById("underline1").style.marginLeft = "0px";
                document.getElementById("underline1").style.width = "178px";

                document.getElementById("form_container").style.height = "706px";

                document.getElementById("form_container").style.top = "-20px";

                document.getElementsByClassName("main_form")[0].style.height = "600px";
                document.getElementsByClassName("main_form")[0].style.marginTop = "20px";

                var elems = document.getElementsByClassName("do_hide");
                for (var i = 0; i < elems.length; i += 1) {
                    elems[i].style.display = 'block';
                }
            }, 300);
        }
    }

    // Function to decide which form operation is going to perform. if hidden field value is signup then signup else login
    function form_operation_selection() {
        if (document.getElementById("form_operation").innerHTML === "signup") {
            do_registration();
        } else {
            do_login();
        }
    }
    //#endregion


    //#region Login User
    function do_login() {
        let email = document.getElementById('user_email').value;
        let password = document.getElementById('user_password').value;

        if (email === "" || email === null || email === undefined) {
            openPopup("Please enter email", "2");
            return;
        }
        if (password === "" || password === null || password === undefined) {
            openPopup("Please enter password", "2");
            return;
        }

        const new_user = {
            email: email,
            password: password
        };

        api_call_to_login_new_user(new_user);
    }

    async function api_call_to_login_new_user(user) {
        try {
            let loggedIn_user = {
                user_name: "null",
                birthdate: "null",
                gender: "null",
                phone: "null",
                email: "null",
                password: "null",
                bio: "null"
            };

            try {
                let response = await fetch('http://localhost:8080/login_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })

                loggedIn_user = await response.json();
            } catch {
                console.log("Internal server error");
            }

            if (loggedIn_user.user_name !== "null") {
                set_user_login_information_in_cache(loggedIn_user);
                navigate(`/feed`);
            } else {
                openPopup("Incorrect credentials", "2");
            }
        } catch (error) {
            openPopup("Internal server error.", "2");
        }
    }

    async function set_user_login_information_in_cache(loggedIn_user) {
        let url = 'http://localhost:4000/api/get_post_count/' + loggedIn_user.user_name;
        let response = await fetch(url, { method: 'GET' });
        let post_count = await response.json();

        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        const touch__user_login_info = {
            user_name: loggedIn_user.user_name,
            birthdate: loggedIn_user.birthdate,
            gender: loggedIn_user.gender,
            phone: loggedIn_user.phone,
            email: loggedIn_user.email,
            password: loggedIn_user.password,
            bio: loggedIn_user.bio,
            login_day: day,
            login_month: month,
            login_year: year,
            post_count: post_count.count
        }

        localStorage.setItem("touch__user_login_info", JSON.stringify(touch__user_login_info));
    }
    //#endregion


    //#region Validating form input
    function check_leap_year(year) {
        if (year % 4 === 0) {
            if (year % 100 === 0) {
                return (year % 400 === 0);
            }
            return true;
        }
        return false;
    }

    // Full validation of all input fields before registration/sign up
    function validate(user_name, birth_date, birth_month, birth_year, password, repeat_password) {
        //console.log(birth_date, birth_month, birth_year, password, repeat_password)
        let d = new Date();
        let current_year = d.getFullYear();

        if (user_name[0] < 'a' || user_name[0] > 'z') {
            openPopup("Username can only start characters in between [a to z]", "2");
            return false;
        }

        if (birth_date < 1) {
            openPopup("Please enter a valid date", "2");
            return false;
        }

        if (birth_month < 1 || birth_month > 12) {
            openPopup("Please enter a valid month", "2");
            return false;
        }

        if (birth_month === "2") {
            if (check_leap_year(birth_year) === true) {
                if (birth_date > 29) {
                    openPopup("Please enter a valid date", "2");
                    return false;
                }
            } else {
                if (birth_date > 28) {
                    openPopup("Please enter a valid date", "2");
                    return false;
                }
            }
        } else {
            if (birth_month === "1" || birth_month === "3" || birth_month === "5" || birth_month === "7"
                || birth_month === "8" || birth_month === "10" || birth_month === "12") {
                if (birth_date > 31) {
                    openPopup("Please enter a valid date", "2");
                    return false;
                }
            } else {
                if (birth_date > 30) {
                    openPopup("Please enter a valid date", "2");
                    return false;
                }
            }
        }

        if (birth_year < 0 || birth_year > current_year) {
            openPopup("Please enter a valid year", "2");
            return false;
        }

        if ((password !== repeat_password)) {
            openPopup("Password and repeat password should be same.", "2");
            return false;
        }

        return true;
    }

    function empty_field_detection(name, birth_date, birth_month, birth_year, gender, phone, email, password, repeat_password) {
        console.log(name)
        if (name === "" || name === null || name === undefined) {
            openPopup("Please enter name", "2");
            return false;
        }
        if (birth_date === "" || birth_date === null || birth_date === undefined) {
            openPopup("Please enter date", "2");
            return false;
        }
        if (birth_month === "" || birth_month === null || birth_month === undefined) {
            openPopup("Please enter month", "2");
            return false;
        }
        if (birth_year === "" || birth_year === null || birth_year === undefined) {
            openPopup("Please enter year", "2");
            return false;
        }
        if (gender === "" || gender === null || gender === undefined || gender === "not_selected") {
            openPopup("Please select gender", "2");
            return false;
        }
        if (phone === "" || phone === null || phone === undefined) {
            openPopup("Please enter phone", "2");
            return false;
        }
        if (email === "" || email === null || email === undefined) {
            openPopup("Please enter email", "2");
            return false;
        }
        if (password === "" || password === null || password === undefined) {
            openPopup("Please enter password", "2");
            return false;
        }
        if (repeat_password === "" || repeat_password === null || repeat_password === undefined) {
            openPopup("Please repeat password", "2");
            return false;
        }

        return true;
    }
    //#endregion


    //#region Registering user
    function do_registration() {
        openLoadingPopup();
        let user_name = document.getElementById('user_name').value;
        let birth_date = document.getElementById('cur_date').value;
        let birth_month = document.getElementById('cur_month').value;
        let birth_year = document.getElementById('cur_year').value;
        let gender = document.getElementById('user_gender').value;
        let phone = document.getElementById('user_phone').value;
        let email = document.getElementById('user_email').value;
        let password = document.getElementById('user_password').value;
        let repeat_password = document.getElementById('repeat_password').value;

        if (!empty_field_detection(user_name, birth_date, birth_month, birth_year, gender, phone, email, password, repeat_password) ||
            !validate(user_name, birth_date, birth_month, birth_year, password, repeat_password)) {
            closeLoadingPopup();
            return;
        }

        let date_of_birth = birth_date + "." + birth_month + "." + birth_year;

        const new_user = {
            user_name: user_name,
            birthdate: date_of_birth,
            gender: gender,
            phone: phone,
            email: email,
            password: password,
            bio: ""
        };

        api_call_to_register_new_user(new_user);
    }

    async function api_call_to_register_new_user(user) {
        try {
            const response = await fetch('http://localhost:8080/register_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const server_response = await response.text();

            let message = "", status = server_response[0];
            for (let i = 2; i < server_response.length; i++) {
                message += server_response[i];
            }

            if (status === "0") {
                document.getElementById('user_name').value = "";
                document.getElementById('cur_date').value = "";
                document.getElementById('cur_month').value = "";
                document.getElementById('cur_year').value = "";
                document.getElementById('user_gender').selectedIndex = 0;
                document.getElementById('user_phone').value = "";
                document.getElementById('user_email').value = "";
                document.getElementById('user_password').value = "";
                document.getElementById('repeat_password').value = "";

                let follow_info = {
                    "username": user.user_name
                }

                await fetch("http://localhost:4000/api/setup", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(follow_info) })
            }
            openPopup(message, status);
        } catch (error) {
            openPopup("Internal server error.", "2");
        }
        closeLoadingPopup()
    }
    //#endregion



    const numberInputInvalidChars = ['-', '+', 'e', 'E', '.'];

    return (
        <>
            {showLoadingPopup && <LoadingPopup />}

            <div className="signup_login_box_parent" id="signup_login_box_parent">
                {showPopup && <Popup onClose={closePopup} message={popup_message} type={popup_type} />}

                <div className="signup_login_box_child">

                    <div className="signup_login_box_grandchild">
                        <div id="signup_login_type_name">
                            <div className="left_container">
                                <h1 id="text1">Already have account?</h1>
                                <h1 id="slider_button" onClick={slider}>Login now.</h1>
                                <span id="underline1"></span>
                            </div>
                        </div>

                        <div id="form_container">
                            <div id="signup_login_form">
                                <h1 className="heading_of_form" id="heading_of_form">SignUp</h1>

                                <form className="main_form">
                                    <p id="form_operation" style={{ display: 'none' }}>signup</p>

                                    <p className="label do_hide">Username (30 chars max)*</p>
                                    <input className="input_field do_hide" id="user_name" type="text" placeholder="Enter your name....."></input>

                                    <div className="date_of_birth">
                                        <div className="date">
                                            <p className="label do_hide">Date*</p>
                                            <input className="input_field do_hide" id="cur_date" type="number" placeholder="Enter birth date....." onKeyDown={(e) => {
                                                if (numberInputInvalidChars.includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}></input>
                                        </div>
                                        <div className="month">
                                            <p className="label do_hide">Month*</p>
                                            <input className="input_field do_hide" id="cur_month" type="number" placeholder="Enter birth month....." onKeyDown={(e) => {
                                                if (numberInputInvalidChars.includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}></input>
                                        </div>
                                        <div className="year">
                                            <p className="label do_hide">Year*</p>
                                            <input className="input_field do_hide" id="cur_year" type="number" placeholder="Enter birth year....." onKeyDown={(e) => {
                                                if (numberInputInvalidChars.includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}></input>
                                        </div>
                                    </div>

                                    <div className="gender">
                                        <label className="label do_hide">Gender*</label>

                                        <select name="gender" id="user_gender" className="gender_selection do_hide">
                                            <option value="not_selected">Choose gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <p className="label do_hide">Phone*</p>
                                    <input className="input_field do_hide" id="user_phone" type="number" placeholder="Enter your mobile....." onKeyDown={(e) => {
                                        if (numberInputInvalidChars.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}></input>

                                    <p className="label">Email*</p>
                                    <input className="input_field" type="text" id="user_email" placeholder="Enter your email....."></input>

                                    <p className="label">Password*</p>
                                    <input className="input_field" type="text" id="user_password" placeholder="Enter your password....."></input>

                                    <p className="label do_hide">Confirm Password*</p>
                                    <input className="input_field do_hide" type="text" id="repeat_password" placeholder="Confirm password....."></input>

                                </form>

                                <button id="signup_login_button" onClick={form_operation_selection}>Register</button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}

export default SignUpLogin;
