import '../CSS for Components/ViewImage.css';

function ViewImage(props) {
    return (
        <>
            <div id="view_image_container">
                <img src={props.url} alt="viewed_image"></img>
            </div>
        </>
    );
}

export default ViewImage