import default_user_logo from '../Images/Default User Logo 2.jpg';

let arr = [];
const localStorageData = localStorage.getItem('previously_searched_profiles');
const retrievedArray = JSON.parse(localStorageData);

if (localStorageData !== null) {
    arr = retrievedArray;
}


let size = arr.length;
let cur;
let list = "";


/* Function to decide if the value at mid index larger/smaller/equal/same_prefix than searched value */
function is_keyword_at_mid_index_larger_than_searched_keyword(mid, searched_val) {
    let i = 0, n = mid.length, m = searched_val.length;
    while (i < n && i < m) {
        if (searched_val[i] < mid[i]) return 1;
        if (mid[i] < searched_val[i]) return 2;
        i++;
    }

    if (i === n && i === m) return 0;
    return (i === m) ? -1 : -2;
}

/* Function to binary_search to find the starting index of the searched value if present, else -1*/
function find_start_position_of_searched_keyword_in_local_cache(searched_val) {
    let index = -1, low = 0, high = size - 1;
    while (low <= high) {
        let mid = parseInt(low + (high - low) / 2);
        let x = is_keyword_at_mid_index_larger_than_searched_keyword(arr[mid], searched_val);
        //console.log("mid->",mid,"arr[mid]->",arr[mid],"x->",x)

        if (x === 0) {
            return mid;
        } else if (x === -1) {
            index = mid;
            high = mid - 1;
        } else if (x === -2) {
            low = mid + 1;
        } else if (x === 1) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    //  0 == searched value already present in array (searched_val = abc) & (mid = abc)
    // -1 == searched value is a prefix of mid value (searched_val = abc) & (mid = abcde)
    // -2 == mid value is a prefix of searched value (searched_val = abcde) & (mid = abc)
    //  1 == searched value is smaller than mid value (searched_val = abc) & (mid = abd)
    //  2 == mid value is smaller than searched value (searched_val = abd) & (mid = abc)

    return index;
}

/* Function to be called on each keystroke and will render result accordingly from cache*/
export const release_keystroke = (event) => {
    if (event.key === 'Enter') return;

    document.getElementById("load_more_button").style.display = "none";
    document.getElementById("no_search_result_text").style.display = "none";
    document.getElementById("load_more_button_from_db").style.display = "none";
    let searched_val = document.getElementById("searchbar_input").value;

    if (searched_val === null || searched_val === "" || searched_val === undefined) {
        document.getElementById("no_search_result_text").style.display = "block";
        return;
    }

    let pos = find_start_position_of_searched_keyword_in_local_cache(searched_val);

    list = "";
    do_render(pos, searched_val);
    cur = pos;
};


/* Function to match prefix returns true/false */
function match_prefix(searched_val, match_val) {
    let i = 0;
    while (i < searched_val.length && i < match_val.length) {
        if (searched_val[i] !== match_val[i]) return false;
        i++;
    }

    return (i === searched_val.length);
}

/* Function to render first 10 searched results */
async function do_render(pos, searched_val) {
    document.getElementById("search_suggession_container").style.display = "block";
    if (pos === -1) {
        document.getElementById("result").innerHTML = "";
        document.getElementById("no_search_result_text").style.display = "block";
        return;
    }

    for (let i = pos; i < Math.min(pos + 10, size); i++) {
        if (match_prefix(searched_val, arr[i])) {
            let dataa = {
                user_name: arr[i],
                profile_photo: "NULL"
            };
            try {
                let response = await fetch('http://localhost:8080/get_profile_photo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: arr[i]
                })

                dataa = await response.json();
            } catch {
                console.log("Internal server error");
            }

            list += create_a_search_result(dataa.profile_photo, arr[i]).outerHTML;
        }
        else {
            document.getElementById("no_search_result_text").style.display = "block";
            document.getElementById("load_more_button").style.display = "none";
            document.getElementById("result").innerHTML = list;
            return;
        }
    }

    if (list === "") {
        document.getElementById("no_search_result_text").style.display = "block";
    }
    document.getElementById("result").innerHTML = list;
    document.getElementById("load_more_button").style.display = "block";
}

/* Call render_load_more_search_items() to keep rendering next 10 searched results on clicking "SHOW MORE" button */
export const load_more_search_items_from_cache = () => {
    render_load_more_search_items();
};

/* Function to keep rendering next 10 searched results on clicking "SHOW MORE" button */
async function render_load_more_search_items() {
    cur += 10;

    if (cur >= size) {
        document.getElementById("no_search_result_text").style.display = "block";
        document.getElementById("load_more_button").style.display = "none";
    }

    let searched_val = document.getElementById("searchbar_input").value;

    for (let i = cur; i < Math.min(cur + 10, size); i++) {
        if (match_prefix(searched_val, arr[i])) {
            let dataa = {
                user_name: arr[i],
                profile_photo: "NULL"
            };
            try {
                let response = await fetch('http://localhost:8080/get_profile_photo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: arr[i]
                })

                dataa = await response.json();
            } catch {
                console.log("Internal server error");
            }

            list += create_a_search_result(dataa.profile_photo, arr[i]).outerHTML;
        }
        else {
            document.getElementById("no_search_result_text").style.display = "block";
            document.getElementById("load_more_button").style.display = "none";
            document.getElementById("result").innerHTML = list;
            return;
        }
    }

    document.getElementById("result").innerHTML = list;
}


/* Function to create a single search result. Contains a profile photo and username */
function create_a_search_result(profile_photo, search_result) {
    let element = document.createElement("div");
    element.className = "single_search_result";

    let image_container = document.createElement("div");
    image_container.className = "image_container";

    let image_element = document.createElement("img");

    if (profile_photo === "NULL" || profile_photo === null || profile_photo === undefined || profile_photo === "") {
        image_element.src = default_user_logo;
    } else {
        image_element.src = "data:image/jpeg;base64," + profile_photo;
    }

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

    return single_suggession;
}
