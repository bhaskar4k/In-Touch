import React from 'react';
import '../CSS for Components/Searchbar.css';
import default_user_logo from '../Images/Default User Logo 2.jpg';
import { release_keystroke, load_more_search_items_from_cache } from '../Implementation/GetSearchResultFromCache.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

let current_search = new Set();

function Searchbar() {
    //#region Global declarations
    let current_offset = 0;
    let list_of_db = "";
    //#endregion


    //#region Function to close the search suggession box 
    function search_result_close_btn() {
        document.getElementById("search_suggession_container").style.display = "none";
        document.getElementById("load_more_button").style.display = "none";
        document.getElementById("no_search_result_text").style.display = "none";
    }
    //#endregion


    //#region Function to be called on clicking "Show More from DB" button
    const fetch_search_items_from_db_on_enter = async (event) => {
        if (event.key === 'Enter') {
            current_offset = 0;
            list_of_db = "";
            document.getElementById("no_search_result_text").style.display = "none";
            document.getElementById("load_more_button").style.display = "none";
            document.getElementById("load_more_button_from_db").style.display = "none";
            document.getElementById("result").innerHTML = "";
            fetch_search_items_from_db();
        }
    }
    //#endregion


    //#region fetching user_profiles from db starts with "search_input" prefix
    function fetch_search_items_from_db() {
        try {
            let typed_prefix = document.getElementById("searchbar_input").value;

            let Search_user_request_parameter = {
                prefix: typed_prefix,
                offset: current_offset
            }

            fetch('http://localhost:8080/find_result_of_searched_input', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Search_user_request_parameter)
            }).then(response => response.json())
                .then(data => {
                    render_search_items_from_db(data);
                })
            current_offset += 10;
        } catch {
            console.log("0", "Internal server error");
        }
    }
    //#endregion


    //#region Function to keep rendering 10 searched results at a time
    function render_search_items_from_db(data) {
        if (data.length < 10) {
            document.getElementById("no_search_result_text").style.display = "block";
            document.getElementById("load_more_button_from_db").style.display = "none";
        } else {
            document.getElementById("no_search_result_text").style.display = "none";
            document.getElementById("load_more_button_from_db").style.display = "block";
        }

        data.forEach(item => {
            list_of_db += create_a_search_result(item.profile_photo, item.user_name).outerHTML;
            current_search.add(item.user_name);
        });

        document.getElementById("result").innerHTML = list_of_db;
    }
    //#endregion


    //#region Function to create a single search result. Contains a profile photo and username 
    function create_a_search_result(profile_photo, search_result) {
        //console.log(profile_photo, search_result)
        let element = document.createElement("div");
        element.className = "single_search_result";

        let image_container = document.createElement("div");
        image_container.className = "image_container";

        let image_element = document.createElement("img");
        if (profile_photo === "NULL") image_element.src = default_user_logo;
        else image_element.src = "data:image/jpeg;base64," + profile_photo;
        image_element.className = "single_search_result_image";

        image_container.appendChild(image_element);

        let username = document.createElement("div");
        username.innerHTML = search_result;
        username.className = "single_search_result_username";

        element.appendChild(image_container);
        element.appendChild(username);

        let single_suggession = document.createElement("a");
        single_suggession.className = "a_single_suggession";
        single_suggession.href = "http://localhost:3000/profile/" + search_result;
        single_suggession.target = "_blank";
        single_suggession.innerHTML = element.outerHTML;

        // console.log(single_suggession)

        return single_suggession;
    }
    //#endregion


    return (
        <>
            <div className='searchbar_container_parent'>
                <div className='searchbar_container'>
                    <div className='searchbar'>
                        <span id='searchbar_placeholder'>Search people</span>
                        <input autoComplete="off" type="text" className='searchbar_input' id="searchbar_input" onKeyUp={release_keystroke} onKeyDown={fetch_search_items_from_db_on_enter} ></input>
                    </div>
                </div>

                <div className='search_suggession_container' id="search_suggession_container">
                    <div id="search_result_cancel_btn"><FontAwesomeIcon icon={faTimes} onClick={search_result_close_btn} /></div>
                    <div id="result"></div>
                    <div onClick={load_more_search_items_from_cache} id="load_more_button">Show more...</div>
                    <div onClick={fetch_search_items_from_db} id="load_more_button_from_db">Show more....</div>
                    <div id="no_search_result_text">[No search result]</div>
                </div>
            </div>
        </>
    );
}

export default Searchbar;
