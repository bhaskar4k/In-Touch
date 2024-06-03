import '../CSS for Components/SingleMessage.css';
import { useState, useEffect } from 'react';


function SingleMessage(props) {
    return (
        <>
            <div className='a_single_message' style={{ backgroundColor: props.bg_color, marginLeft: props.margin_left }}>
                <p className='the_message'>{props.message}</p>
                <div className='sent_time'>
                    <p className='sent_time'>{props.sent_time}</p>
                </div>
            </div>
        </>
    );
}

export default SingleMessage;