import React, { useState, useEffect, useRef } from "react";
import '../CSS for Components/PostRenderingAnimation.css';


function PostRenderingAnimation(props) {
    return (
        <>
            <div className="PostRenderingAnimation">
                <div className="loader"></div>
                <div className="rendering_text">{props.text}</div>
            </div>
        </>
    );
}

export default PostRenderingAnimation;
