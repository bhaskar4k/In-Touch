import React, { useState, useEffect } from "react";
import '../CSS for Components/Popup.css';
import cancel_button from '../Images/Cancel.png';

// type 0 = success (green)
// type 1 = warning (orange)
// type 2 = error (red)

const Popup = ({ onClose, message, type }) => {
    //#region Global declarations
    const [countdown, setCountdown] = useState(10);
    const [width, setWidth] = useState('100%');
    let backgroundColor;
    let second = 9;
    //#endregion


    //#region Setting up background color of popup
    if (type === "0") {
        backgroundColor = "rgb(15, 179, 0)";
    } else if (type === "1") {
        backgroundColor = "rgb(252, 127, 3)";
    } else {
        backgroundColor = "rgb(252, 3, 3)";
    }
    //#endregion


    //#region Timer to display the popup and close afterwards
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
            second--;
            const percentage = (second / 9) * 100;
            setWidth(percentage + "%");
        }, 1000);

        return () => clearInterval(interval);
    }, [second]);

    useEffect(() => {
        if (countdown === 0) {
            onClose();
        }
    }, [countdown, onClose]);

    const handleCancel = () => {
        onClose();
    };
    //#endregion

    return (
        <>
            <div className="popup_container" style={{ backgroundColor }}>
                <img src={cancel_button} alt="Cancel" className="cancel_popup_button" onClick={handleCancel} />
                <p className="popup_message">{message}</p>
                {/* <div>Auto closing in {countdown} seconds</div> */}


                <div className="countdown-bar" id="countdownBar" style={{ width }}></div>
            </div>
        </>
    );
}

export default Popup;
