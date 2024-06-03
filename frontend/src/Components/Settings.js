import '../CSS for Components/Settings.css';
import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function Settings() {
    //#region Global declarations
    const user_login_info_from_cache = JSON.parse(localStorage.getItem("touch__user_login_info"));
    const logged_in_user_name = user_login_info_from_cache.user_name;
    const [input_birthdate, set_input_birthdate] = useState("");
    const [input_birthmonth, set_input_birthmonth] = useState("");
    const [input_birthyear, set_input_birthyear] = useState("");
    const [input_phone, set_input_phone] = useState("");
    const [input_email, set_input_email] = useState("");
    const [input_password, set_input_password] = useState("");
    const [input_bio, set_input_bio] = useState("");
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [popup_message, set_popup_message] = useState("");
    const [popup_type, set_popup_type] = useState("");
    //#endregion


    //#region Filling up user details in settings form
    useEffect(() => {
        if (user_login_info_from_cache !== null) {
            let birthdate = user_login_info_from_cache.birthdate, temp = "";
            let temp2 = 0;
            for (let i = 0; i < birthdate.length; i++) {
                if (birthdate[i] === '.') {
                    if (temp2 === 0) set_input_birthdate(temp);
                    else set_input_birthmonth(temp);
                    temp = "";
                    temp2++;
                    continue;
                }
                temp += birthdate[i];
            }
            set_input_birthyear(temp);
            set_input_phone(user_login_info_from_cache.phone);
            set_input_email(user_login_info_from_cache.email);
            set_input_password(user_login_info_from_cache.password);
            set_input_bio(user_login_info_from_cache.bio);
        }
    }, []);

    const handleInputChangeBirthdate = (e) => {
        set_input_birthdate(e.target.value);
    };
    const handleInputChangeBirthmonth = (e) => {
        set_input_birthmonth(e.target.value);
    };
    const handleInputChangeBirthyear = (e) => {
        set_input_birthyear(e.target.value);
    };
    const handleInputChangePhone = (e) => {
        set_input_phone(e.target.value);
    };
    const handleInputChangeEmail = (e) => {
        set_input_email(e.target.value);
    };
    const handleInputChangePassword = (e) => {
        set_input_password(e.target.value);
    };
    const handleInputChangeBio = (e) => {
        set_input_bio(e.target.value);
    };
    //#endregion


    //#region Function to logout/Clearing user_data from cache  
    function logout() {
        localStorage.removeItem("touch__user_login_info");
        localStorage.removeItem("previously_searched_profiles");
        navigate(`/home`);
    }
    // #endregion ---------------------------------------------------


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


    //#region Validating form input
    // Check leap year
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
    function validate(user_name, birth_date, birth_month, birth_year, field_name) {
        let d = new Date();
        let current_year = d.getFullYear();

        if (field_name === "username") {
            if (user_name[0] < 'a' || user_name[0] > 'z') {
                openPopup("Username can only start characters in between [a to z]", "2");
                return false;
            }
        } else if (field_name === "birthdate") {
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
        }

        return true;
    }

    // Detection of any empty field before registration/sign up
    function empty_field_detection(name, field_name) {
        if (name === "" || name === null || name === undefined) {
            openPopup("Please enter " + field_name, "2");
            return false;
        }

        return true;
    }
    //#endregion


    //#region Open/Close settings
    function close_settings() {
        if (document.getElementById("settings_div").style.height === "0px") {
            document.getElementById("settings_div").style.height = "600px";
            document.getElementById("settings_div").style.width = "700px";
            document.getElementById("settings_div").style.border = "2px solid rgb(0, 140, 255)";
        } else {
            document.getElementById("settings_div").style.height = "0px";
            document.getElementById("settings_div").style.width = "0px";
            document.getElementById("settings_div").style.border = "none";
            if (document.getElementById("profile_container") !== null) {
                document.getElementById("profile_container").style.filter = "blur(0px)";
            }
            if (document.getElementById("actual_feed_container") !== null) {
                document.getElementById("actual_feed_container").style.filter = "blur(0px)";
            }
        }
    }
    // #endregion


    //#region Update function to to update new data
    function update_service(input_field_name) {
        if (input_field_name === "dob") {
            let dob_date = document.getElementById("dob_date").value;
            let dob_month = document.getElementById("dob_month").value;
            let dob_year = document.getElementById("dob_year").value;

            if (!empty_field_detection(dob_date, "birth date") || !empty_field_detection(dob_month, "birth month") ||
                !empty_field_detection(dob_year, "birth year") || !validate("NULL", dob_date, dob_month, dob_year, "birthdate")) {
                return;
            }

            let date_of_birth = dob_date + "." + dob_month + "." + dob_year;
            api_call_to_update_in_DB(date_of_birth, "birthdate");
        }
        else if (input_field_name === "phone") {
            let phone = document.getElementById("phone").value;

            if (!empty_field_detection(phone, "phone number")) {
                return;
            }

            api_call_to_update_in_DB(phone, "phone");
        }
        else if (input_field_name === "email") {
            let email = document.getElementById("email").value;

            if (!empty_field_detection(email, "email ID")) {
                return;
            }

            api_call_to_update_in_DB(email, "email");
        }
        else if (input_field_name === "password") {
            let password = document.getElementById("password").value;

            if (!empty_field_detection(password, "password")) {
                return;
            }

            api_call_to_update_in_DB(password, "password");
        }
        else if (input_field_name === "bio") {
            let bio = document.getElementById("bio").value;

            api_call_to_update_in_DB(bio, "bio");
        }
    }


    async function api_call_to_update_in_DB(updated_value, field_name) {
        try {
            let Update_user = {
                updated_value: updated_value,
                field_name: field_name,
                user_name: logged_in_user_name
            }

            const response = await fetch('http://localhost:8080/update_user_information', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Update_user)
            });

            const server_response = await response.text();

            if (server_response[0] === "3") {
                if (field_name === "email") {
                    openPopup("Email: [ " + updated_value + " ] is not available/used by other user. Try something new.", "2");
                }
            }
            else if (server_response[0] === "2") {
                openPopup("Internal server error.", "2");
            } else {
                if (field_name === "birthdate" || field_name === "phone" || field_name === "bio") {
                    update_localcache_by_newly_updated_user_data(field_name, updated_value);
                } else {
                    logout();
                }
            }
        } catch (error) {
            openPopup("Internal server error.", "2");
        }
    }


    function update_localcache_by_newly_updated_user_data(field_name, value) {
        localStorage.removeItem("touch__user_login_info");

        if (field_name === "birthdate") {
            user_login_info_from_cache.birthdate = value;
        } else if (field_name === "phone") {
            user_login_info_from_cache.phone = value;
        } else {
            user_login_info_from_cache.bio = value;
        }

        localStorage.setItem("touch__user_login_info", JSON.stringify(user_login_info_from_cache));
        window.location.reload();
    }
    // #endregion


    //#region Delete account
    async function delete_account() {
        try {
            const response = await fetch('http://localhost:8080/delete_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logged_in_user_name)
            });

            const server_response = await response.text();

            if (server_response[0] === "0") {
                logout();
            } else {
                openPopup("Internal server error.", "2");
            }
        } catch (error) {
            openPopup("Internal server error.", "2");
        }
    }
    //#endregion


    const numberInputInvalidChars = ['-', '+', 'e', 'E', '.'];
    return (
        <>
            {showPopup && <Popup onClose={closePopup} message={popup_message} type={popup_type} />}

            <div className='settings'>
                <div className='change_info'>
                    <p>Bio</p>
                    <input type="text" className="change_input_all" id="bio" value={input_bio} onChange={handleInputChangeBio}></input>
                    <button onClick={() => update_service("bio")}>Update</button>
                </div>
                <div className='change_info'>
                    <p>DOB (DD/MM/YYYY)</p>
                    <div className='change_input_birthday'>
                        <input type="number" id="dob_date" value={input_birthdate} onChange={handleInputChangeBirthdate} onKeyDown={(e) => {
                            if (numberInputInvalidChars.includes(e.key)) {
                                e.preventDefault();
                            }
                        }}></input>
                        <input type="number" id="dob_month" value={input_birthmonth} onChange={handleInputChangeBirthmonth} onKeyDown={(e) => {
                            if (numberInputInvalidChars.includes(e.key)) {
                                e.preventDefault();
                            }
                        }}></input>
                        <input type="number" id="dob_year" value={input_birthyear} onChange={handleInputChangeBirthyear} onKeyDown={(e) => {
                            if (numberInputInvalidChars.includes(e.key)) {
                                e.preventDefault();
                            }
                        }}></input>
                    </div>
                    <button onClick={() => update_service("dob")}>Update</button>
                </div>
                <div className='change_info'>
                    <p>Phone number</p>
                    <input type="number" className="change_input_all" id="phone" value={input_phone} onChange={handleInputChangePhone} onKeyDown={(e) => {
                        if (numberInputInvalidChars.includes(e.key)) {
                            e.preventDefault();
                        }
                    }}></input>
                    <button onClick={() => update_service("phone")}>Update</button>
                </div>
                <div className='change_info'>
                    <p>Email ID</p>
                    <input type="text" id="email" className="change_input_all" value={input_email} onChange={handleInputChangeEmail}></input>
                    <button onClick={() => update_service("email")}>Update</button>
                </div>
                <div className='change_info'>
                    <p>Password</p>
                    <input type="text" id="password" className="change_input_all" value={input_password} onChange={handleInputChangePassword}></input>
                    <button onClick={() => update_service("password")}>Update</button>
                </div>
                <div className='delete_account'>
                    <button onClick={delete_account}>Delete Account</button>
                </div>

                <div id="settings_close_btn"><FontAwesomeIcon icon={faTimes} onClick={close_settings} /></div>
            </div>
        </>
    );
}

export default Settings;
